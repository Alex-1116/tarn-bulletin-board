# Convenience commands for Docker Compose

.PHONY: up down logs restart build

# Start services in background with rebuild
up:
	docker compose up --build -d

# Stop services
down:
	docker compose down

# View logs
logs:
	docker compose logs -f

# Restart services
restart: down up

# Build only
build:
	docker compose build
