all:
	docker-compose up --build -d
	docker-compose exec backend python home_api/manage.py makemigrations
	docker-compose exec backend python home_api/manage.py migrate
	docker-compose logs -f

migrate:
	docker-compose exec backend python home_api/manage.py makemigrations
	docker-compose exec backend python home_api/manage.py migrate