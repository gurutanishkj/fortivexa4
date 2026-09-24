"""
Database Engine & Session Management for FORTIVEXA
Primary: PostgreSQL
Fallback: Local SQLite (Explicitly labeled as DEV FALLBACK)
"""

import time
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session
from .config import DATABASE_URL, DEV_FALLBACK_SQLITE, SQLITE_FALLBACK_URL
from .models import Base

logger = logging.getLogger("fortivexa.database")

# Runtime database status telemetry
db_status = {
    "engine_type": "UNKNOWN",
    "primary_configured": bool(DATABASE_URL and "postgresql" in DATABASE_URL),
    "primary_connected": False,
    "fallback_active": False,
    "connection_url_masked": "",
    "latency_ms": None,
    "last_checked": None,
    "error_message": None,
    "table_counts": {}
}

SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False))
engine = None


def mask_url(url: str) -> str:
    if not url:
        return ""
    if "@" in url:
        prefix, rest = url.split("://", 1)
        auth, host_db = rest.split("@", 1)
        user = auth.split(":")[0] if ":" in auth else auth
        return f"{prefix}://{user}:*****@{host_db}"
    return url


def init_db():
    global engine, SessionLocal, db_status
    start_time = time.time()
    
    # Attempt primary PostgreSQL first
    pg_connected = False
    if db_status["primary_configured"]:
        try:
            logger.info("Attempting connection to primary PostgreSQL...")
            pg_engine = create_engine(
                DATABASE_URL,
                pool_pre_ping=True,
                pool_size=5,
                max_overflow=10,
                connect_args={"connect_timeout": 3}
            )
            with pg_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            engine = pg_engine
            db_status["engine_type"] = "POSTGRESQL_PRIMARY"
            db_status["primary_connected"] = True
            db_status["fallback_active"] = False
            db_status["connection_url_masked"] = mask_url(DATABASE_URL)
            db_status["latency_ms"] = round((time.time() - start_time) * 1000, 2)
            db_status["error_message"] = None
            pg_connected = True
            logger.info("Successfully connected to PostgreSQL primary.")
        except Exception as e:
            logger.warning(f"PostgreSQL unreachable ({e}). Checking fallback policy.")
            db_status["primary_connected"] = False
            db_status["error_message"] = str(e)

    # If PostgreSQL failed or wasn't configured, use SQLite fallback if enabled
    if not pg_connected:
        if DEV_FALLBACK_SQLITE:
            logger.info("Engaging SQLite dev fallback engine...")
            engine = create_engine(
                SQLITE_FALLBACK_URL,
                connect_args={"check_same_thread": False}
            )
            db_status["engine_type"] = "SQLITE_DEV_FALLBACK"
            db_status["fallback_active"] = True
            db_status["connection_url_masked"] = SQLITE_FALLBACK_URL
            db_status["latency_ms"] = round((time.time() - start_time) * 1000, 2)
        else:
            raise RuntimeError(
                "PostgreSQL connection failed and DEV_FALLBACK_SQLITE is disabled. "
                "Check DATABASE_URL."
            )

    db_status["last_checked"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    SessionLocal.configure(bind=engine)

    # Create tables if not existing
    Base.metadata.create_all(bind=engine)
    refresh_table_counts()
    return engine


def get_db():
    """FastAPI Dependency for database session"""
    if SessionLocal is None:
        init_db()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def refresh_table_counts():
    global db_status
    if not engine:
        return
    try:
        from .models import (
            Complaint, Transaction, Account, Location,
            Prediction, RiskAlert, ModelRun, IntegrityRecord, User
        )
        with SessionLocal() as db:
            db_status["table_counts"] = {
                "complaints": db.query(Complaint).count(),
                "transactions": db.query(Transaction).count(),
                "accounts": db.query(Account).count(),
                "locations": db.query(Location).count(),
                "predictions": db.query(Prediction).count(),
                "risk_alerts": db.query(RiskAlert).count(),
                "model_runs": db.query(ModelRun).count(),
                "integrity_records": db.query(IntegrityRecord).count(),
                "users": db.query(User).count()
            }
    except Exception as e:
        logger.warning(f"Could not refresh table counts: {e}")


def check_db_health():
    """Live diagnostic check for /health/database"""
    global db_status
    start = time.time()
    if engine is None:
        init_db()
    
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        latency = round((time.time() - start) * 1000, 2)
        db_status["latency_ms"] = latency
        db_status["last_checked"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        refresh_table_counts()
        return {
            "status": "HEALTHY" if db_status["primary_connected"] else "DEGRADED_FALLBACK",
            "telemetry": db_status
        }
    except Exception as e:
        return {
            "status": "UNHEALTHY",
            "error": str(e),
            "telemetry": db_status
        }


# Auto-initialize database on import so SessionLocal is immediately bound
try:
    init_db()
except Exception as _e:
    logger.warning(f"Initial DB bootstrap notice: {_e}")
