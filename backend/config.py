import os
import secrets
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present in root or backend
env_paths = [
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent / ".env",
]
for p in env_paths:
    if p.exists():
        load_dotenv(p)
        break

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "backend" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/fortivexa"
)
DEV_FALLBACK_SQLITE = os.getenv("DEV_FALLBACK_SQLITE", "true").lower() in ("true", "1", "yes")
SQLITE_FALLBACK_URL = f"sqlite:///{DATA_DIR / 'fortivexa_dev.db'}"

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "fortivexa_secret_2026")

# Generate or load 256-bit AES-GCM encryption key
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    # 32 random bytes in hex (256-bit key)
    ENCRYPTION_KEY = secrets.token_hex(32)

JWT_SECRET = os.getenv("JWT_SECRET", "fortivexa_academic_trl5_jwt_secret_2026_safe")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

TLS_CERT_PATH = os.getenv("TLS_CERT_PATH", "")
TLS_KEY_PATH = os.getenv("TLS_KEY_PATH", "")

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "5001"))
