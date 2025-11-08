# TitanRooms Backend

Express + MongoDB backend for room and reservation management.

---

## Requirements
- Node.js 20+
- Docker & Docker Compose
- `.env` file with:
```bash
JWT_TOKEN=your_jwt_secret
ADMIN_KEY=your_admin_key
```
> An example `.env.example` is provided at the repo root dir for reference

---

## Running locally

#### Run with Docker (recommended)
```bash
docker compose up --build
```
Server runs at http://localhost:3000


#### or Run Manually
```bash
npm install
npm run build
node build/main.js
```
> In this case, MongoDB needs to be setup locally - [setup guide here](https://www.mongodb.com/docs/manual/installation/) if needed


---

#### Run tests
```bash
npm install
npx jest
```
> restart the containers before and after tests to flush out using `docker compose down` and `docker compose up -d`

---

### Directory Structure

```bash
- src/ # Source files
- tests/ # Jest tests
- build/ # Compiled output
- .env # Environment config (create one)
- docker-compose.yml & Dockerfile #containers for db & backend
```