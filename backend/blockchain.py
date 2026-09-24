"""
Cryptographic SHA-256 Chain of Custody & Evidence Ledger for FORTIVEXA (TRL 5 Prototype)
Implements:
- Tamper-evident ledger linking each block to previous block hash
- Real-time cryptographic recalculation and verification
- Interactive tamper simulation demonstrating forensic discrepancy detection
"""

import json
import hashlib
import datetime
from pathlib import Path
from typing import Dict, List, Any

from .config import DATA_DIR

LEDGER_FILE = DATA_DIR / "blockchain_ledger.json"

ledger_memory: List[Dict[str, Any]] = []


def calculate_sha256(data_str: str) -> str:
    return hashlib.sha256(data_str.encode("utf-8")).hexdigest()


def init_blockchain(force_reseed: bool = False):
    """Initializes or loads the cryptographic blockchain audit ledger"""
    global ledger_memory
    if LEDGER_FILE.exists() and not force_reseed:
        try:
            with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                ledger_memory = json.load(f)
                return ledger_memory
        except Exception:
            pass

    ledger_memory = []
    # 1. Genesis Block
    genesis_payload = json.dumps({
        "type": "GENESIS_AUDIT_ROOT",
        "description": "FORTIVEXA TRL 5 Cryptographic Evidence Anchor",
        "standard": "SHA-256 Tamper-Evident Merkle Pointer Chain",
        "timestamp": "2026-06-01T00:00:00Z"
    }, sort_keys=True)
    genesis_p_hash = calculate_sha256(genesis_payload)
    genesis_prev = "0" * 64
    genesis_b_hash = calculate_sha256(genesis_prev + genesis_p_hash + "0" + "2026-06-01T00:00:00Z")

    ledger_memory.append({
        "index": 0,
        "timestamp": "2026-06-01T00:00:00Z",
        "reference_id": "GENESIS-ROOT",
        "operation": "AUDIT_GENESIS_ROOT",
        "payload": genesis_payload,
        "payload_hash": genesis_p_hash,
        "previous_hash": genesis_prev,
        "block_hash": genesis_b_hash,
        "status": "VERIFIED_VALID"
    })

    # Seed 8 realistic audit blocks for FIRs and predictions
    seed_ops = [
        {"ref": "CMP-1001", "op": "COMPLAINT_INGESTION_SEAL", "desc": "UPI Phishing reported ₹95,000 via Axis mule"},
        {"ref": "RING-01", "op": "MULE_RING_CORRELATION", "desc": "Apex Syndicate correlated across 4 complaints"},
        {"ref": "PRED-CMP-1001", "op": "LOCATION_PREDICTION_DISPATCH", "desc": "Forecasted LOC-001 (Sector 4 Central ATM)"},
        {"ref": "CMP-1002", "op": "COMPLAINT_INGESTION_SEAL", "desc": "Telegram Task scam reported ₹1,42,000"},
        {"ref": "RING-02", "op": "MULE_RING_CORRELATION", "desc": "East Coast Job-Scam Hub correlated"},
        {"ref": "PRED-CMP-1002", "op": "LOCATION_PREDICTION_DISPATCH", "desc": "Forecasted LOC-003 (Outer Ring Road ATM)"},
        {"ref": "DISPATCH-CMP-1001", "op": "QRT_PATROL_DISPATCH", "desc": "QRT Unit Alpha dispatched to LOC-001"},
        {"ref": "EVIDENCE-CMP-1001", "op": "CASH_WITHDRAWAL_INTERCEPTED", "desc": "Physical cashout intercepted, ₹95,000 preserved"}
    ]

    for idx, item in enumerate(seed_ops, start=1):
        prev_block = ledger_memory[-1]
        ts = (datetime.datetime(2026, 6, 1, 9, 0) + datetime.timedelta(hours=idx * 2)).isoformat() + "Z"
        payload_str = json.dumps(item, sort_keys=True)
        p_hash = calculate_sha256(payload_str)
        b_hash = calculate_sha256(prev_block["block_hash"] + p_hash + str(idx) + ts)

        ledger_memory.append({
            "index": idx,
            "timestamp": ts,
            "reference_id": item["ref"],
            "operation": item["op"],
            "payload": payload_str,
            "payload_hash": p_hash,
            "previous_hash": prev_block["block_hash"],
            "block_hash": b_hash,
            "status": "VERIFIED_VALID"
        })

    save_ledger()
    return ledger_memory


def save_ledger():
    with open(LEDGER_FILE, "w", encoding="utf-8") as f:
        json.dump(ledger_memory, f, indent=2)


def get_blockchain_ledger() -> List[Dict[str, Any]]:
    global ledger_memory
    if not ledger_memory:
        init_blockchain()
    return ledger_memory


def append_audit_block(reference_id: str, operation: str, details: Dict[str, Any]) -> Dict[str, Any]:
    global ledger_memory
    if not ledger_memory:
        init_blockchain()

    prev_block = ledger_memory[-1]
    new_idx = len(ledger_memory)
    ts = datetime.datetime.utcnow().isoformat() + "Z"
    payload_str = json.dumps(details, sort_keys=True)
    p_hash = calculate_sha256(payload_str)
    b_hash = calculate_sha256(prev_block["block_hash"] + p_hash + str(new_idx) + ts)

    new_block = {
        "index": new_idx,
        "timestamp": ts,
        "reference_id": reference_id,
        "operation": operation,
        "payload": payload_str,
        "payload_hash": p_hash,
        "previous_hash": prev_block["block_hash"],
        "block_hash": b_hash,
        "status": "VERIFIED_VALID"
    }

    ledger_memory.append(new_block)
    save_ledger()
    return new_block


def verify_ledger_integrity() -> Dict[str, Any]:
    """Recomputes all block hashes and verifies pointer chain"""
    global ledger_memory
    if not ledger_memory:
        init_blockchain()

    is_valid = True
    tampered_indices = []
    recalculated = []

    for i in range(len(ledger_memory)):
        block = ledger_memory[i]
        expected_prev = "0" * 64 if i == 0 else ledger_memory[i - 1]["block_hash"]
        
        # Check previous hash pointer
        pointer_match = (block["previous_hash"] == expected_prev)
        
        # Recalculate block hash
        p_hash = calculate_sha256(block["payload"])
        recomputed_b_hash = calculate_sha256(
            expected_prev + p_hash + str(block["index"]) + block["timestamp"]
        )
        hash_match = (recomputed_b_hash == block["block_hash"]) and pointer_match

        if not hash_match:
            is_valid = False
            tampered_indices.append(block["index"])
            block["status"] = "TAMPERED_HASH_MISMATCH"
        else:
            block["status"] = "VERIFIED_VALID"

        recalculated.append({
            "index": block["index"],
            "reference_id": block["reference_id"],
            "hash_valid": hash_match,
            "status": block["status"]
        })

    return {
        "verified_at": datetime.datetime.utcnow().isoformat() + "Z",
        "total_blocks": len(ledger_memory),
        "chain_integrity_status": "INTACT" if is_valid else "TAMPER_DETECTED",
        "tampered_blocks_count": len(tampered_indices),
        "tampered_indices": tampered_indices,
        "blocks": recalculated
    }


def simulate_tamper_attack(block_index: int = 3) -> Dict[str, Any]:
    """Intentionally alters payload of a past block to prove cryptographic tamper detection"""
    global ledger_memory
    if not ledger_memory:
        init_blockchain()

    if block_index < 0 or block_index >= len(ledger_memory):
        block_index = 3

    target = ledger_memory[block_index]
    target["payload"] = json.dumps({"item": "TAMPERED_FRAUD_RECORD_MALICIOUS_ALTERATION"}, sort_keys=True)
    target["status"] = "TAMPERED_MODIFIED"
    save_ledger()

    # Re-verify immediately to demonstrate detection
    verification = verify_ledger_integrity()
    return {
        "action": "SIMULATED_TAMPER_ATTACK",
        "tampered_index": block_index,
        "verification_result": verification
    }


def reset_and_repair_ledger() -> Dict[str, Any]:
    """Repairs and rebuilds valid cryptographic hashes across ledger"""
    global ledger_memory
    init_blockchain(force_reseed=True)
    return verify_ledger_integrity()
