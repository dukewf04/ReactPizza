FROM python:3.11.1-slim

EXPOSE 5000

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY src .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]