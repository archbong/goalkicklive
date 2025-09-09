
# README: Next.js + Prisma + PostgreSQL with Docker on Linux/Parrot OS

This repository demonstrates how to set up a **Next.js** application with **Prisma ORM** and **PostgreSQL** running inside **Docker** on Linux systems (including Parrot OS). It also documents common errors encountered during setup and their solutions, making it a reference for any developer starting a similar project.

---

## 📌 Prerequisites
Ensure the following are installed:
- **Docker** (>= 24.x)
- **Docker Compose** (>= 2.x)
- **Node.js** (>= 18)
- **npm** or **yarn**
- A working **Next.js** project (`npx create-next-app@latest`)

---

## ⚙️ Project Structure
```
your-project/
├── app/                 # Next.js app directory (or pages/)
├── prisma/
│   └── schema.prisma   # Your database schema
├── docker-compose.yml   # Docker services definition
├── .env                # Environment variables
└── package.json
```

---

## ⚙️ Environment Setup
Create a `.env` file at the root of your project:

```env
# PostgreSQL Credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=supersecurepassword
POSTGRES_DB=goalkicklive

# Prisma Connection String
# For the Next.js app running on your host machine to connect to the DB in Docker
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"

# Alternative if facing connection issues from host:
# DATABASE_URL="postgresql://postgres:supersecurepassword@host.docker.internal:5432/goalkicklive?schema=public"
```

> ⚠️ **Warning:** Never commit your `.env` file to version control. Add it to your `.gitignore`.

---

## 🐳 Docker Setup
Create a `docker-compose.yml` file to define your PostgreSQL service:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: goal_kick_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app_network

volumes:
  postgres_data:

networks:
  app_network:
    driver: bridge
```

**Start the database:**
```bash
docker-compose up -d
```

**Stop the database:**
```bash
docker-compose down
```

---

## 🗃️ Prisma Setup

1.  **Install Prisma:**
    ```bash
    npm install prisma --save-dev
    npm install @prisma/client
    ```

2.  **Initialize Prisma:**
    ```bash
    npx prisma init
    ```

3.  **Define your schema in `prisma/schema.prisma`:**
    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model User {
      id    Int     @id @default(autoincrement())
      email String  @unique
      name  String?
    }
    ```

4.  **Generate the Prisma Client and push the schema to your database:**
    ```bash
    npx prisma generate
    npx prisma db push
    # Or, for production, use migrations:
    # npx prisma migrate dev --name init
    ```

---

## 🔧 Next.js Integration

Create a utility file to instantiate the Prisma client. A common pattern is `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Now you can use Prisma in your Next.js API routes or Server Components:

```typescript
// app/api/users/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
```

---

## 🐧 Linux/Parrot OS Specific Issues & Solutions

### 1. Docker Permission Denied Error
**Error:** `Got permission denied while trying to connect to the Docker daemon socket`

**Solution:** Add your user to the `docker` group.
```bash
sudo usermod -aG docker $USER
# Log out and log back in for the changes to take effect.
# You can also run: newgrp docker
```

### 2. Port 5432 Already In Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5432`

**Solution:** This usually means a local PostgreSQL instance is running. Stop it.
```bash
# For systems using systemd (e.g., Ubuntu, Parrot OS)
sudo systemctl stop postgresql
sudo systemctl disable postgresql # To prevent it from starting on boot
```

### 3. "Host not found" or Connection Refused from Next.js
**Problem:** Next.js running on the host can't connect to `localhost:5432` inside the Docker container.

**Solutions:**
*   **Use the special DNS name `host.docker.internal`** (Update your `.env`):
    ```env
    DATABASE_URL="postgresql://postgres:supersecurepassword@host.docker.internal:5432/goalkicklive?schema=public"
    ```
*   **Use the Docker network's IP address.** Find your Docker network IP and use it in the connection string.
*   **Run Next.js in Docker too.** This is the most robust solution, creating a multi-container app with `docker-compose` where both services are on the same network and can communicate using the service name (`postgres`).

### 4. Prisma Engine Binary Download Failure
**Error:** `Error: Unable to require(`/node_modules/.prisma/client/query-engine-debian-openssl-3.0.x`)` or similar.

**Solution:** Prisma needs to download a platform-specific binary. Often, installing `openssl` is required.
```bash
# On Debian/Ubuntu/Parrot OS
sudo apt update
sudo apt install openssl
```
Then, regenerate the Prisma client:
```bash
npx prisma generate --force
```

---

## 🚀 Development Workflow

1.  Start the Docker database: `docker-compose up -d`
2.  Install npm dependencies: `npm install`
3.  Generate Prisma client: `npx prisma generate`
4.  Update your database schema: `npx prisma db push` (dev) or `npx prisma migrate dev` (with migrations)
5.  Run the development server: `npm run dev`
6.  Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/api/users](http://localhost:3000/api/users) to test.

---

## 📚 Useful Commands

- **Open Prisma Studio:** View and edit your database data visually.
  ```bash
  npx prisma studio
  ```
- **Run a migration:** After changing your `schema.prisma`.
  ```bash
  npx prisma migrate dev --name add_new_field
  ```
- **Reset the database:** (Use with caution!)
  ```bash
  npx prisma migrate reset
  ```