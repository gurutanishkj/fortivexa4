"""
SQLAlchemy Models for FORTIVEXA — TRL 5 Cybercrime Predictive Intelligence Platform
Covers all 13 PostgreSQL tables with PKs, FKs, and indexes on critical search vectors:
complaint_id, transaction_id, account_id, timestamp, location_id, risk_score.
"""

import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Index
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(64), unique=True, nullable=False, index=True)
    email = Column(String(128), unique=True, nullable=False, index=True)
    hashed_password = Column(String(256), nullable=False)
    role = Column(String(32), default="ANALYST", nullable=False)  # ADMIN, ANALYST, VIEWER
    full_name = Column(String(128), nullable=False)
    badge_id = Column(String(64), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    location_id = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(256), nullable=False)
    type = Column(String(64), default="ATM", nullable=False)  # ATM, e-Lobby, Branch Kiosk
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    jurisdiction = Column(String(128), nullable=False)
    city = Column(String(64), default="Bengaluru", nullable=False)
    risk_index = Column(Float, default=0.5, nullable=False, index=True)
    historical_cashouts = Column(Integer, default=0, nullable=False)

    predictions = relationship("Prediction", back_populates="location")
    alerts = relationship("RiskAlert", back_populates="location")


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(String(64), unique=True, nullable=False, index=True)
    bank_name_anon = Column(String(128), nullable=False)
    ifsc_mask = Column(String(32), nullable=False)
    phone_suffix = Column(String(16), default="0000")
    role = Column(String(32), default="mule_l1", nullable=False)  # victim, mule_l1, mule_l2, withdrawal
    risk_rating = Column(String(32), default="MEDIUM", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(32), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(String(64), unique=True, nullable=False, index=True)
    complainant_name_anon = Column(String(128), nullable=False)
    category = Column(String(128), nullable=False)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)
    status = Column(String(64), default="Open", nullable=False)  # Open, Under Investigation, Actioned - Location Flagged, Closed
    priority = Column(String(16), default="P1", nullable=False)  # P1, P2, P3
    victim_account = Column(String(64), default="")
    target_l1_mule = Column(String(64), default="")
    target_l2_mule = Column(String(64), default="")
    reporting_station = Column(String(128), default="Cyber North PS")
    city = Column(String(64), default="Bengaluru")
    narrative_summary = Column(Text, default="")
    assigned_officer = Column(String(128), default="CYB-DEL-742")
    record_type = Column(String(32), default="SYNTHETIC_DEMO", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    transactions = relationship("Transaction", back_populates="complaint")
    predictions = relationship("Prediction", back_populates="complaint")
    alerts = relationship("RiskAlert", back_populates="complaint")
    investigations = relationship("InvestigationCase", back_populates="complaint")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(String(64), unique=True, nullable=False, index=True)
    complaint_id = Column(String(64), ForeignKey("complaints.complaint_id"), nullable=False, index=True)
    from_account_id = Column(String(64), nullable=False, index=True)
    to_account_id = Column(String(64), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    channel = Column(String(32), default="UPI", nullable=False)  # UPI, IMPS, NEFT, ATM_WITHDRAWAL
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)
    risk_score = Column(Float, default=0.5, nullable=False, index=True)
    hop_level = Column(Integer, default=1, nullable=False)  # 1 (Victim->L1), 2 (L1->L2), 3 (L2->Withdrawal)
    is_mule = Column(Boolean, default=False, nullable=False)
    record_type = Column(String(32), default="SYNTHETIC_DEMO", nullable=False)

    complaint = relationship("Complaint", back_populates="transactions")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    prediction_id = Column(String(64), unique=True, nullable=False, index=True)
    complaint_id = Column(String(64), ForeignKey("complaints.complaint_id"), nullable=False, index=True)
    location_id = Column(String(64), ForeignKey("locations.location_id"), nullable=False, index=True)
    predicted_risk = Column(Float, nullable=False, index=True)  # 0.0 - 1.0
    confidence = Column(Float, nullable=False)  # percentage
    rank = Column(Integer, default=1, nullable=False)
    time_window_start = Column(DateTime, nullable=True)
    time_window_end = Column(DateTime, nullable=True)
    features_json = Column(Text, default="{}")
    explanation_json = Column(Text, default="{}")
    label_type = Column(String(64), default="model-estimated risk", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    complaint = relationship("Complaint", back_populates="predictions")
    location = relationship("Location", back_populates="predictions")


class RiskAlert(Base):
    __tablename__ = "risk_alerts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    alert_id = Column(String(64), unique=True, nullable=False, index=True)
    complaint_id = Column(String(64), ForeignKey("complaints.complaint_id"), nullable=False, index=True)
    location_id = Column(String(64), ForeignKey("locations.location_id"), nullable=True, index=True)
    alert_type = Column(String(64), nullable=False)  # High Velocity Siphoning, Imminent Cashout, Mule Ring Recurrence
    priority = Column(String(16), default="CRITICAL", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(32), default="NEW", nullable=False)  # NEW, REVIEWING, DISMISSED, RESOLVED
    message = Column(Text, nullable=False)
    triggered_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    complaint = relationship("Complaint", back_populates="alerts")
    location = relationship("Location", back_populates="alerts")


class ModelRun(Base):
    __tablename__ = "model_runs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(64), unique=True, nullable=False, index=True)
    model_name = Column(String(128), nullable=False)
    model_type = Column(String(64), nullable=False)  # XGBoost, RandomForest, LogisticRegression
    train_loss = Column(Float, nullable=True)
    test_accuracy = Column(Float, nullable=False)
    precision_score = Column(Float, nullable=False)
    recall_score = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=True)
    hyperparameters = Column(Text, default="{}")
    trained_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    metrics = relationship("ModelMetric", back_populates="run")


class ModelMetric(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    metric_id = Column(String(64), unique=True, nullable=False, index=True)
    run_id = Column(String(64), ForeignKey("model_runs.run_id"), nullable=False, index=True)
    metric_name = Column(String(64), nullable=False)
    metric_value = Column(Float, nullable=False)
    dataset_split = Column(String(32), default="test", nullable=False)
    computed_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    run = relationship("ModelRun", back_populates="metrics")


class InvestigationCase(Base):
    __tablename__ = "investigation_cases"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String(64), unique=True, nullable=False, index=True)
    complaint_id = Column(String(64), ForeignKey("complaints.complaint_id"), nullable=False, index=True)
    priority = Column(String(16), default="P1", nullable=False)
    lead_investigator = Column(String(128), nullable=False)
    dispatch_status = Column(String(64), default="STANDBY", nullable=False)  # STANDBY, DISPATCHED, QRT_EN_ROUTE, INTERCEPTED, CLOSED
    notes = Column(Text, default="")
    patrol_unit = Column(String(64), default="QRT-UNIT-04")
    funds_preserved = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    complaint = relationship("Complaint", back_populates="investigations")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    log_id = Column(String(64), unique=True, nullable=False, index=True)
    user_id = Column(String(64), nullable=False, index=True)
    action = Column(String(64), nullable=False)
    resource = Column(String(128), nullable=False)
    endpoint = Column(String(128), nullable=False)
    status_code = Column(Integer, default=200)
    ip_address = Column(String(64), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)
    details = Column(Text, default="")


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    experiment_id = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(128), nullable=False)
    model_type = Column(String(64), nullable=False)
    params_json = Column(Text, default="{}")
    metrics_json = Column(Text, default="{}")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


class IntegrityRecord(Base):
    __tablename__ = "integrity_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    block_id = Column(String(64), unique=True, nullable=False, index=True)
    index_num = Column(Integer, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    reference_id = Column(String(64), nullable=False, index=True)
    operation = Column(String(64), nullable=False)
    payload_hash = Column(String(64), nullable=False)
    previous_hash = Column(String(64), nullable=False)
    block_hash = Column(String(64), nullable=False)
    status = Column(String(32), default="VERIFIED_VALID", nullable=False)


# Multi-column indexes
Index("idx_transactions_complaint_time", Transaction.complaint_id, Transaction.timestamp)
Index("idx_predictions_complaint_risk", Prediction.complaint_id, Prediction.predicted_risk)
Index("idx_complaints_status_priority", Complaint.status, Complaint.priority)
