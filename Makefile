# ---------------------------------------------------------------------------- #
#                                    COMMAND                                   #
# ---------------------------------------------------------------------------- #

DOCKER_COMPOSE := $(shell \
    if command -v docker compose > /dev/null 2>&1; then \
        echo "docker compose"; \
    else \
        echo "docker-compose"; \
    fi)

# ---------------------------------------------------------------------------- #
#                                     RULES                                    #
# ---------------------------------------------------------------------------- #

all: build migrate logs

build:
	@$(DOCKER_COMPOSE) up --build -d

logs:
	@$(DOCKER_COMPOSE) logs -f $(SERVICE)

migrate:
	@$(DOCKER_COMPOSE) exec backend python home_api/manage.py makemigrations
	@$(DOCKER_COMPOSE) exec backend python home_api/manage.py migrate

down:
	@$(DOCKER_COMPOSE) down

re: down all

.PHONY: all build logs migrate down re