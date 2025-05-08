from prefect import flow, task
from prefect.tasks import task_input_hash
from datetime import timedelta
import redis
import json
from typing import List, Dict, Any

# Initialize Redis client
redis_client = redis.Redis.from_url('redis://localhost:6379')

@task(cache_key_fn=task_input_hash, cache_expiration=timedelta(hours=1))
def fetch_team_members() -> List[Dict[str, Any]]:
    """Fetch team members and cache them in Redis."""
    members = [
        {"id": "1", "name": "Nguyễn Thành Đạt", "role": "GK", "image": "/Avatar teams/Đạt.jfif"},
        {"id": "2", "name": "Lê Vũ Nhật Minh", "role": "RB"},
        {"id": "3", "name": "Nguyễn Đỗ Bảo Khánh", "role": "CB"},
        {"id": "4", "name": "Nguyễn Đức Bảo Phong", "role": "CB"},
        {"id": "5", "name": "Vũ Nhật Ninh", "role": "RB"},
        {"id": "6", "name": "Phạm Công Toàn", "role": "LB"},
        {"id": "7", "name": "Hoàng Đặng Việt Hùng", "role": "CDM", "image": "/Avatar teams/Hùng.png", "captain": True},
        {"id": "8", "name": "Đỗ Quốc Khánh", "role": "AMF"},
        {"id": "9", "name": "Phạm Anh Phương", "role": "LW", "image": "/Avatar teams/Phương.jfif"},
        {"id": "10", "name": "Nguyễn Quang Minh Thành", "role": "CF"},
        {"id": "11", "name": "Đặng Minh Việt", "role": "RW"},
        {"id": "12", "name": "Trần Minh Đức", "role": "CF", "image": "/Avatar teams/Duc.JPG"},
    ]
    redis_client.setex('team:members', 3600, json.dumps(members))
    return members

@task(cache_key_fn=task_input_hash, cache_expiration=timedelta(minutes=30))
def fetch_matches() -> List[Dict[str, Any]]:
    """Fetch matches and cache them in Redis."""
    # This would normally fetch from your database
    matches = []  # Add your match fetching logic here
    redis_client.setex('matches:all', 1800, json.dumps(matches))
    return matches

@task(cache_key_fn=task_input_hash, cache_expiration=timedelta(minutes=15))
def fetch_tickets() -> List[Dict[str, Any]]:
    """Fetch tickets and cache them in Redis."""
    # This would normally fetch from your database
    tickets = []  # Add your ticket fetching logic here
    redis_client.setex('tickets:all', 900, json.dumps(tickets))
    return tickets

@flow(name="Football Club Data Sync")
def sync_football_club_data():
    """Main flow to sync all football club data."""
    team_members = fetch_team_members()
    matches = fetch_matches()
    tickets = fetch_tickets()
    
    return {
        "team_members": team_members,
        "matches": matches,
        "tickets": tickets
    }

@flow(name="Cache Invalidation")
def invalidate_cache(cache_key: str):
    """Flow to invalidate specific cache entries."""
    redis_client.delete(cache_key)

if __name__ == "__main__":
    # Run the sync flow
    sync_football_club_data() 