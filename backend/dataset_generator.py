"""
FORTIVEXA - Synthetic Cybercrime Dataset Generator (TRL 5 Prototype)
Generates:
- 500 complaints tagged SYNTHETIC/DEMO
- 5,000 multi-hop transactions (Victim -> L1 Mule -> L2 Mule -> Withdrawal)
- 500 accounts (victims, L1 mules, L2 mules, cashout accounts)
- 28 ATM / Kiosk / e-Lobby withdrawal locations across 8 metro zones
- 25 ground-truth seeded multi-hop fraud rings
"""

import json
import random
import datetime
from pathlib import Path
from typing import Dict, List, Any

# Fixed seed for reproducibility
random.seed(42)

REGIONS = [
    {"city": "Bengaluru", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946, "ps": "Cyber Crime PS Bengaluru"},
    {"city": "Delhi-NCR", "state": "Delhi", "lat": 28.6139, "lng": 77.2090, "ps": "IFSO Cyber Cell Delhi"},
    {"city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777, "ps": "BKC Cyber Police Mumbai"},
    {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867, "ps": "Cyberabad Cyber Crime PS"},
    {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639, "ps": "Lalbazar Cyber PS Kolkata"},
    {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707, "ps": "Vepery Cyber Crime Cell"},
    {"city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714, "ps": "Ahmedabad Cyber Police"},
    {"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567, "ps": "Shivajinagar Cyber Cell"}
]

FRAUD_CATEGORIES = [
    "UPI Phishing / Impersonation",
    "Part-Time Job / Telegram Task Scam",
    "Fake Stock Investment & IPO Advisory",
    "Electricity Bill / Immediate Disconnection Fraud",
    "Instant Loan App Extortion & Blackmail",
    "SIM Swap / OTP Interception",
    "Digital Arrest / Fake Law Enforcement Call",
    "Crypto Arbitrage / Foreign Exchange Ponzi"
]

BANK_NAMES = [
    "State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", "Axis Bank",
    "Punjab National Bank (PNB)", "Kotak Mahindra Bank", "Bank of Baroda",
    "Federal Bank", "Canara Bank", "Union Bank of India", "Yes Bank", "IndusInd Bank"
]

ANONYMIZED_NAMES = [
    "Rajesh K.", "Priya S.", "Amitabh M.", "Sunita R.", "Deepak N.",
    "Kavita B.", "Vikram T.", "Ananya G.", "Manoj P.", "Rohit V.",
    "Neha D.", "Suresh J.", "Pooja L.", "Arjun K.", "Sneha M."
]


def generate_locations() -> List[Dict[str, Any]]:
    locations = []
    loc_id_counter = 1
    for region in REGIONS:
        base_lat = region["lat"]
        base_lng = region["lng"]
        city = region["city"]
        ps = region["ps"]

        # Generate 3-4 ATM/Branch kiosks per region
        kiosk_names = [
            f"{city} Central Railway Plaza Kiosk",
            f"{city} Tech Park North e-Lobby",
            f"{city} Metro Interchange ATM",
            f"{city} Commercial Ring Road Kiosk"
        ]

        for i, name in enumerate(kiosk_names):
            loc_id = f"LOC-{loc_id_counter:03d}"
            lat_offset = (random.random() - 0.5) * 0.08
            lng_offset = (random.random() - 0.5) * 0.08
            risk = round(0.40 + random.random() * 0.55, 2)
            historical = random.randint(15, 95)
            locations.append({
                "location_id": loc_id,
                "name": name,
                "type": "e-Lobby" if i == 1 else "ATM",
                "lat": round(base_lat + lat_offset, 5),
                "lng": round(base_lng + lng_offset, 5),
                "jurisdiction": ps,
                "city": city,
                "risk_index": risk,
                "historical_cashouts": historical
            })
            loc_id_counter += 1
    return locations


def generate_accounts() -> List[Dict[str, Any]]:
    accounts = []
    # 500 accounts: 100 Victims, 180 Mule L1, 160 Mule L2, 60 Cashout
    roles_distribution = (
        [("victim", "LOW", "SBIN")] * 100 +
        [("mule_l1", "HIGH", "UTIB")] * 180 +
        [("mule_l2", "CRITICAL", "ICIC")] * 160 +
        [("withdrawal", "CRITICAL", "YESB")] * 60
    )

    for idx, (role, risk, ifsc_prefix) in enumerate(roles_distribution, start=1):
        acc_id = f"ACC-{role.upper()[:4]}-{idx:04d}"
        bank = random.choice(BANK_NAMES)
        ifsc = f"{ifsc_prefix}0{random.randint(100000, 999999)}"
        phone = f"{random.randint(1000, 9999)}"
        accounts.append({
            "account_id": acc_id,
            "bank_name_anon": bank,
            "ifsc_mask": ifsc,
            "phone_suffix": phone,
            "role": role,
            "risk_rating": risk,
            "status": "FLAGGED" if "mule" in role or role == "withdrawal" else "ACTIVE",
            "created_at": (datetime.datetime(2026, 1, 1) + datetime.timedelta(days=random.randint(0, 180))).isoformat() + "Z"
        })
    return accounts


def generate_dataset() -> Dict[str, Any]:
    locations = generate_locations()
    accounts = generate_accounts()

    acc_by_role = {"victim": [], "mule_l1": [], "mule_l2": [], "withdrawal": []}
    for acc in accounts:
        role = acc["role"]
        if role in acc_by_role:
            acc_by_role[role].append(acc["account_id"])

    # Build 25 Seeded Syndicates (Mule Rings) tied to specific operational regions
    rings = []
    for r_idx in range(1, 26):
        ring_id = f"RING-{r_idx:02d}"
        region = REGIONS[(r_idx - 1) % len(REGIONS)]
        city = region["city"]
        city_locs = [l for l in locations if l["city"] == city]
        if not city_locs:
            city_locs = locations

        l1_pool = random.sample(acc_by_role["mule_l1"], 3)
        l2_shared = random.choice(acc_by_role["mule_l2"])
        cashout_target = random.choice(acc_by_role["withdrawal"])
        primary_loc = random.choice(city_locs)["location_id"]
        rings.append({
            "ring_id": ring_id,
            "name": f"{city} Syndicate Cluster #{r_idx}",
            "city": city,
            "reporting_station": region["ps"],
            "l1_mules": l1_pool,
            "shared_l2_mule": l2_shared,
            "cashout_account": cashout_target,
            "primary_location": primary_loc,
            "member_case_ids": []
        })

    # Generate 500 Complaints & 5,000 Transactions
    complaints = []
    transactions = []
    tx_counter = 1
    base_time = datetime.datetime(2026, 6, 1, 9, 0, 0)

    for c_idx in range(1, 501):
        cmp_id = f"CMP-{1000 + c_idx}"
        category = random.choice(FRAUD_CATEGORIES)
        amount = round(random.uniform(15000, 350000), 2)
        complainant = random.choice(ANONYMIZED_NAMES)
        cmp_time = base_time + datetime.timedelta(hours=c_idx * 1.8, minutes=random.randint(5, 55))
        
        # Link 70% of complaints to one of the 25 seeded rings
        if random.random() < 0.70:
            ring = random.choice(rings)
            ring["member_case_ids"].append(cmp_id)
            victim_acc = random.choice(acc_by_role["victim"])
            l1_acc = random.choice(ring["l1_mules"])
            l2_acc = ring["shared_l2_mule"]
            cashout_acc = ring["cashout_account"]
            assigned_loc = ring["primary_location"]
            city = ring["city"]
            ps = ring["reporting_station"]
        else:
            region = random.choice(REGIONS)
            city = region["city"]
            ps = region["ps"]
            city_locs = [l for l in locations if l["city"] == city]
            victim_acc = random.choice(acc_by_role["victim"])
            l1_acc = random.choice(acc_by_role["mule_l1"])
            l2_acc = random.choice(acc_by_role["mule_l2"])
            cashout_acc = random.choice(acc_by_role["withdrawal"])
            assigned_loc = random.choice(city_locs)["location_id"] if city_locs else random.choice(locations)["location_id"]

        complaints.append({
            "complaint_id": cmp_id,
            "complainant_name_anon": complainant,
            "category": category,
            "amount": amount,
            "timestamp": cmp_time.isoformat() + "Z",
            "status": random.choice(["Open", "Under Investigation", "Actioned - Location Flagged", "Escalated"]),
            "priority": "P1" if amount > 100000 else "P2",
            "victim_account": victim_acc,
            "target_l1_mule": l1_acc,
            "target_l2_mule": l2_acc,
            "reporting_station": ps,
            "city": city,
            "narrative_summary": f"Victim reported fraudulent debit of ₹{amount:,.2f} via {category}. Siphoned to intermediary mule {l1_acc}.",
            "assigned_officer": f"CYB-{city[:3].upper()}-{random.randint(100, 999)}",
            "record_type": "SYNTHETIC_DEMO",
            "ground_truth_location_id": assigned_loc
        })

        # Multi-Hop Transactions for this complaint:
        # Hop 1: Victim -> Mule L1 (1-2 txns)
        # Hop 2: Mule L1 -> Mule L2 (2-4 split txns)
        # Hop 3: Mule L2 -> Cashout (2-4 withdrawal txns)
        # Total per complaint ~ 8-12 txns => 500 complaints * 10 = ~5,000 transactions!
        
        # Hop 1: Siphoning from Victim to L1
        t1_time = cmp_time + datetime.timedelta(minutes=random.randint(2, 10))
        tx1_id = f"TXN-{tx_counter:06d}"
        transactions.append({
            "transaction_id": tx1_id,
            "complaint_id": cmp_id,
            "from_account_id": victim_acc,
            "to_account_id": l1_acc,
            "amount": amount,
            "channel": "UPI",
            "timestamp": t1_time.isoformat() + "Z",
            "risk_score": 0.82,
            "hop_level": 1,
            "is_mule": True,
            "record_type": "SYNTHETIC_DEMO"
        })
        tx_counter += 1

        # Hop 2: Layering split from L1 to L2 (3-5 transactions)
        split_count = random.randint(3, 5)
        split_amt = round(amount / split_count, 2)
        for s_idx in range(split_count):
            t2_time = t1_time + datetime.timedelta(minutes=random.randint(8, 25) * (s_idx + 1))
            tx2_id = f"TXN-{tx_counter:06d}"
            transactions.append({
                "transaction_id": tx2_id,
                "complaint_id": cmp_id,
                "from_account_id": l1_acc,
                "to_account_id": l2_acc,
                "amount": split_amt,
                "channel": random.choice(["IMPS", "NEFT"]),
                "timestamp": t2_time.isoformat() + "Z",
                "risk_score": 0.88,
                "hop_level": 2,
                "is_mule": True,
                "record_type": "SYNTHETIC_DEMO"
            })
            tx_counter += 1

        # Hop 3: Layering to Cashout proxy / ATM withdrawal (3-5 transactions)
        cash_splits = random.randint(3, 5)
        c_amt = round(amount / cash_splits, 2)
        for w_idx in range(cash_splits):
            t3_time = t1_time + datetime.timedelta(minutes=random.randint(35, 90) * (w_idx + 1))
            tx3_id = f"TXN-{tx_counter:06d}"
            transactions.append({
                "transaction_id": tx3_id,
                "complaint_id": cmp_id,
                "from_account_id": l2_acc,
                "to_account_id": cashout_acc,
                "amount": c_amt,
                "channel": "ATM_WITHDRAWAL",
                "timestamp": t3_time.isoformat() + "Z",
                "risk_score": 0.94,
                "hop_level": 3,
                "is_mule": True,
                "record_type": "SYNTHETIC_DEMO"
            })
            tx_counter += 1

    dataset = {
        "metadata": {
            "version": "5.0.0-TRL5",
            "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
            "seed": 42,
            "total_complaints": len(complaints),
            "total_transactions": len(transactions),
            "total_accounts": len(accounts),
            "total_locations": len(locations),
            "seeded_rings": len(rings),
            "label": "SYNTHETIC_ANONYMIZED_ACADEMIC_DATASET"
        },
        "complaints": complaints,
        "transactions": transactions,
        "accounts": accounts,
        "locations": locations,
        "rings": rings
    }
    return dataset


def save_dataset_and_seed_db(output_file: Path = None):
    if output_file is None:
        output_file = Path(__file__).resolve().parent / "data" / "dataset_trl5.json"
    output_file.parent.mkdir(parents=True, exist_ok=True)

    dataset = generate_dataset()
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)

    return dataset


if __name__ == "__main__":
    ds = save_dataset_and_seed_db()
    print(f"Generated {ds['metadata']['total_complaints']} complaints, {ds['metadata']['total_transactions']} txns.")
