#!/bin/bash

# Start Prefect server
prefect server start &

# Wait for server to start
sleep 5

# Deploy flows
python -c "
from src.lib.prefect.flows import sync_football_club_data, invalidate_cache
from prefect.deployments import Deployment

# Create deployment for sync flow
sync_deployment = Deployment.build_from_flow(
    flow=sync_football_club_data,
    name='football-club-sync',
    version=1,
    schedule='0 */1 * * *'  # Run every hour
)

# Create deployment for cache invalidation
cache_deployment = Deployment.build_from_flow(
    flow=invalidate_cache,
    name='cache-invalidation',
    version=1
)

# Apply deployments
sync_deployment.apply()
cache_deployment.apply()
" 