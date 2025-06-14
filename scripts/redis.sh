#!/bin/bash

case "$1" in
  "start")
    echo "Starting Redis container..."
    docker-compose up -d redis
    ;;
  "stop")
    echo "Stopping Redis container..."
    docker-compose stop redis
    ;;
  "restart")
    echo "Restarting Redis container..."
    docker-compose restart redis
    ;;
  "status")
    echo "Checking Redis container status..."
    docker-compose ps redis
    ;;
  "logs")
    echo "Showing Redis container logs..."
    docker-compose logs -f redis
    ;;
  "cli")
    echo "Connecting to Redis CLI..."
    docker exec -it fc-website-redis redis-cli
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs|cli}"
    exit 1
    ;;
esac

exit 0 