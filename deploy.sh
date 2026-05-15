#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env.prod ]]; then
  echo "Missing .env.prod. Copy from .env.prod.example and edit it." >&2
  exit 1
fi

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

docker exec -it smart_buy_list_backend npx prisma migrate deploy

printf "\nDeployment finished. Visit: %s\n" "$(grep VITE_API_URL .env.prod | cut -d= -f2)"
