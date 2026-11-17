# Build
FROM ubuntu:26.04

RUN apt-get update
RUN apt-get install python3 python3-pip python3-venv ffmpeg -y

WORKDIR /app

COPY ./fileapi/ ./fileapi/

WORKDIR /app/fileapi

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir -r requirements.txt

ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]