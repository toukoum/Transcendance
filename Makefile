all:
	docker-compose up --build
	chmod -R 777 ./.data/pgadmin
	docker compose exec backend python home_api/manage.py makemigrations