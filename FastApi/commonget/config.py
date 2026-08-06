import os
import sys
from dotenv import load_dotenv

# Load .env
if getattr(sys, "frozen", False):
    BASE_DIR = os.path.dirname(sys.executable)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv(os.path.join(BASE_DIR, ".env"))


def get_env(key):
    value = os.getenv(key)

    if value is None:
        raise Exception(f"{key} not found in .env")

    return value


# Database
DB_DRIVER = get_env("DB_DRIVER")
DB_SERVER = get_env("DB_SERVER")
DB_NAME = get_env("DB_NAME")
DB_USER = get_env("DB_USER")
DB_PASSWORD = get_env("DB_PASSWORD")

CONNECTION_STRING = (
    f"DRIVER={{{DB_DRIVER}}};"
    f"SERVER={DB_SERVER};"
    f"DATABASE={DB_NAME};"
    f"UID={DB_USER};"
    f"PWD={DB_PASSWORD};"
)

# API
API_KEY_CODE = get_env("API_KEY_CODE")

# Server
HOST = get_env("HOST")
PORT = int(get_env("PORT"))

# Logging
LOG_LEVEL = get_env("LOG_LEVEL")
DEBUG = get_env("DEBUG").lower() == "true"