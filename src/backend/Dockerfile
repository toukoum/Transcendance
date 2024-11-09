FROM python:3.12

WORKDIR /app

RUN pip install --upgrade pip
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

ENV PYTHONUNBUFFERED 1

EXPOSE 8000

CMD ["python", "./home_api/manage.py", "runserver", "0.0.0.0:8000"]