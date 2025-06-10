#!/bin/sh

DOCKER_BUILDKIT=1

docker compose -f docker-compose-production.yml up --build --detach
docker build -f Dockerfile --target production -o /var/www/cmcwork .
