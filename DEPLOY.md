# Deployment (VPS + Docker)

## Prerequisites
- Docker + Docker Compose installed on the VPS
- Domain or server IP available
- Ports 80 (and later 443) open

## 1) Clone the repo
```bash
git clone <YOUR_REPO_URL>
cd TS_buying_list
```

## 2) Create production env file
```bash
cp .env.prod.example .env.prod
```
Edit `.env.prod`:
- `VITE_API_URL` -> `http://<server-ip>` (or your domain later)
- `MYSQL_ROOT_PASSWORD` -> strong password
- `DATABASE_URL` -> update with the same password

## 3) Build + run
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

## 4) Run migrations
```bash
docker exec -it smart_buy_list_backend npx prisma migrate deploy
```

## 5) Smoke test
- Frontend: `http://<server-ip>`
- API: `http://<server-ip>/api/lists` (POST)

## 6) Logs / health
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f --tail=200
```

## Next (HTTPS)
Once domain DNS points to the VPS, add HTTPS with Nginx + Let’s Encrypt.
