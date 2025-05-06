from prefect import settings

# Configure Prefect settings
settings.update(
    {
        "PREFECT_API_URL": "http://localhost:4200",
        "PREFECT_LOGGING_LEVEL": "INFO",
        "PREFECT_LOGGING_FORMAT": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        "PREFECT_LOGGING_DATEFMT": "%Y-%m-%d %H:%M:%S",
    }
)

# Redis configuration
REDIS_CONFIG = {
    "host": "localhost",
    "port": 6379,
    "db": 0,
    "decode_responses": True
}

# Cache configuration
CACHE_CONFIG = {
    "team_members": {
        "key": "team:members",
        "ttl": 3600  # 1 hour
    },
    "matches": {
        "key": "matches:all",
        "ttl": 1800  # 30 minutes
    },
    "tickets": {
        "key": "tickets:all",
        "ttl": 900  # 15 minutes
    }
} 