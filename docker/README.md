# docker/

Container-specific configuration that is mounted into services at runtime.

- `mariadb/my.cnf` — MariaDB server tuning (charset, connections), mounted
  read-only into the `mariadb` service.

Service Dockerfiles live next to their code (`frontend/Dockerfile`,
`backend/Dockerfile`, `nginx/Dockerfile`); orchestration lives in the
root `docker-compose.yml`.
