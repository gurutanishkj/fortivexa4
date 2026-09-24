"""
Initializes and populates database with synthetic TRL 5 dataset.
"""

import os
import json
import datetime
from pathlib import Path

from .database import init_db, SessionLocal, engine
from .models import (
    Complaint, Transaction, Account, Location, User,
    RiskAlert, IntegrityRecord, InvestigationCase
)
from .dataset_generator import save_dataset_and_seed_db
from .neo4j_service import populate_graph, detect_mule_rings, init_neo4j
from .data_quality import evaluate_data_quality

def run_seed():
    print("[1/5] Initializing database engine and tables...")
    init_db()

    print("[2/5] Generating 500 complaints / 5,000 txns / 500 accounts / 28 locations...")
    dataset = save_dataset_and_seed_db()

    print("[3/5] Seeding structured database tables...")
    db = SessionLocal()
    try:
        # Always clean previous records before re-seeding
        print("Clearing any existing data table records...")
        db.query(InvestigationCase).delete()
        db.query(RiskAlert).delete()
        db.query(Transaction).delete()
        db.query(Complaint).delete()
        db.query(Account).delete()
        db.query(Location).delete()
        db.commit()

        # Seed Locations
        loc_map = {}
        for l in dataset["locations"]:
            loc_obj = Location(
                location_id=l["location_id"],
                name=l["name"],
                type=l["type"],
                lat=l["lat"],
                lng=l["lng"],
                jurisdiction=l["jurisdiction"],
                city=l["city"],
                risk_index=l["risk_index"],
                historical_cashouts=l["historical_cashouts"]
            )
            db.add(loc_obj)
            loc_map[l["location_id"]] = loc_obj

        # Seed Accounts
        for a in dataset["accounts"]:
            acc_obj = Account(
                account_id=a["account_id"],
                bank_name_anon=a["bank_name_anon"],
                ifsc_mask=a["ifsc_mask"],
                phone_suffix=a.get("phone_suffix", "0000"),
                role=a["role"],
                risk_rating=a["risk_rating"],
                status=a["status"]
            )
            db.add(acc_obj)

        # Seed Complaints
        for c in dataset["complaints"]:
            ts = datetime.datetime.fromisoformat(c["timestamp"].replace("Z", "+00:00"))
            cmp_obj = Complaint(
                complaint_id=c["complaint_id"],
                complainant_name_anon=c["complainant_name_anon"],
                category=c["category"],
                amount=c["amount"],
                timestamp=ts,
                status=c["status"],
                priority=c["priority"],
                victim_account=c["victim_account"],
                target_l1_mule=c["target_l1_mule"],
                target_l2_mule=c["target_l2_mule"],
                reporting_station=c["reporting_station"],
                city=c["city"],
                narrative_summary=c["narrative_summary"],
                assigned_officer=c["assigned_officer"],
                record_type=c["record_type"]
            )
            db.add(cmp_obj)

            # Add investigation case for P1 cases
            if c["priority"] == "P1":
                inv = InvestigationCase(
                    case_id=f"INV-{c['complaint_id']}",
                    complaint_id=c["complaint_id"],
                    priority="P1",
                    lead_investigator=c["assigned_officer"],
                    dispatch_status="STANDBY",
                    notes="Automated priority queue assignment.",
                    patrol_unit=f"QRT-{c['city'][:3].upper()}-01"
                )
                db.add(inv)

        # Seed Transactions
        for t in dataset["transactions"]:
            ts = datetime.datetime.fromisoformat(t["timestamp"].replace("Z", "+00:00"))
            tx_obj = Transaction(
                transaction_id=t["transaction_id"],
                complaint_id=t["complaint_id"],
                from_account_id=t["from_account_id"],
                to_account_id=t["to_account_id"],
                amount=t["amount"],
                channel=t["channel"],
                timestamp=ts,
                risk_score=t["risk_score"],
                hop_level=t["hop_level"],
                is_mule=t["is_mule"],
                record_type=t["record_type"]
            )
            db.add(tx_obj)

        # Seed Seeded Users (Investigator, Admin, Viewer)
        import hashlib
        def hash_pwd(pwd: str) -> str:
            salt = b"fortivexa_salt_2026"
            return hashlib.pbkdf2_hmac("sha256", pwd.encode(), salt, 100000).hex()

        if db.query(User).count() == 0:
            demo_users = [
                User(
                    user_id="USR-INV-01",
                    email="investigator.le@fortivexa.local",
                    hashed_password=hash_pwd("investigator123"),
                    role="ANALYST",
                    full_name="Officer CYB-DEL-742",
                    badge_id="LE-CYBER-884"
                ),
                User(
                    user_id="USR-AUD-01",
                    email="sih-audit@fortivexa.local",
                    hashed_password=hash_pwd("admin123"),
                    role="ADMIN",
                    full_name="Academic Evaluator SIH",
                    badge_id="SIH-AUDIT-2026"
                ),
                User(
                    user_id="USR-VIEW-01",
                    email="observer@fortivexa.local",
                    hashed_password=hash_pwd("viewer123"),
                    role="VIEWER",
                    full_name="Observer Guest",
                    badge_id="OBSERVER-01"
                )
            ]
            for u in demo_users:
                db.add(u)

        db.commit()
        print("Database tables populated successfully!")
    finally:
        db.close()

    print("[4/5] Initializing Graph Engine (Neo4j / NetworkX)...")
    init_neo4j()
    populate_graph(
        accounts=dataset["accounts"],
        complaints=dataset["complaints"],
        transactions=dataset["transactions"],
        locations=dataset["locations"]
    )
    rings = detect_mule_rings()
    print(f"Graph loaded with {len(rings)} detected mule rings.")

    print("[5/5] Evaluating Data Quality...")
    dq = evaluate_data_quality(dataset)
    print(f"Dataset Completeness: {dq['completeness_percentage']}%, Validity: {dq['validity_percentage']}%")

    # Also write a copy to src/data for client-side fallback
    client_data_dir = Path(__file__).resolve().parent.parent / "src" / "data"
    client_data_dir.mkdir(parents=True, exist_ok=True)
    with open(client_data_dir / "dataset_trl5.json", "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)

    return dataset

if __name__ == "__main__":
    run_seed()
