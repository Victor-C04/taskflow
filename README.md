# TaskFlow — Full-Stack Task Workflow Management Application

A modern, full-stack task management application built using **Angular, NestJS, Prisma ORM, and PostgreSQL**.

TaskFlow helps users organize, manage, and track tasks through an intuitive Kanban-style workflow. It features secure JWT authentication, role-based access, task ownership, and persistent cloud database storage.

### Live Demo

**[Launch TaskFlow](https://taskflow-frontend-ashy-three.vercel.app)**

**[GitHub Repository](https://github.com/Victor-C04/taskflow)**

---

## Features

### Authentication and User Management
- User registration and secure login using JWT authentication.
- Role-based access with Admin and Member roles.
- User-specific task ownership and access control.
- Session management with token expiration handling.

### Task Management
- Create new tasks.
- Edit existing task details.
- Delete tasks.
- Update task status.
- Organize tasks using a Kanban-style workflow board.
- Track tasks through different workflow stages.

### User Interface
- Responsive interface for desktop and mobile devices.
- Interactive task management dashboard.
- Task organization based on workflow status.
- Dynamic updates using Angular Signals.

### Database and Security
- PostgreSQL database for persistent task and user storage.
- Prisma ORM for database access and schema migrations.
- Password hashing and JWT-based authentication.
- Backend validation using NestJS.
- Task ownership enforcement through backend authorization.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular, TypeScript, HTML, CSS |
| Backend | NestJS, Node.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Cloud Database | Neon PostgreSQL |
| Version Control | Git, GitHub |

---

## System Architecture

```text
                   USER
                     |
                     v
            Angular Frontend
                 (Vercel)
                     |
                HTTPS / REST
                     |
                     v
              NestJS Backend
                 (Render)
                     |
              Prisma ORM
                     |
                     v
             PostgreSQL Database
                   (Neon)
```

The Angular frontend communicates with the NestJS REST API over HTTPS. The backend handles authentication, authorization, validation, and task operations. Prisma manages database interactions with PostgreSQL.

---

## Project Structure

```text
taskflow/
|
|-- taskflow-frontend/
|   |-- src/
|   |   |-- app/
|   |   |   |-- config/
|   |   |   |-- interceptors/
|   |   |   |-- models/
|   |   |   |-- services/
|   |   |   |-- ...
|   |-- angular.json
|   |-- package.json
|
|-- taskflow-backend/
|   |-- backend/
|       |-- prisma/
|       |   |-- migrations/
|       |   |-- schema.prisma
|       |-- src/
|       |   |-- auth/
|       |   |-- users/
|       |   |-- tasks/
|       |   |-- prisma/
|       |   |-- main.ts
|       |-- prisma.config.ts
|       |-- package.json
|
|-- .gitignore
|-- README.md
```

---

## Getting Started

### Prerequisites

Install the following tools:

- Node.js and npm
- Git
- PostgreSQL (local installation or Docker)
- Angular CLI

### 1. Clone the Repository

```bash
git clone https://github.com/Victor-C04/taskflow.git
cd taskflow
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd taskflow-backend/backend
npm install
```

Create a `.env` file inside the backend directory:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/taskflow_db?schema=public"
JWT_SECRET="YOUR_SECURE_RANDOM_SECRET"
PORT=3000
FRONTEND_URL="http://localhost:4200"
```

Replace the database credentials with your own PostgreSQL configuration.

Generate a secure JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Do not commit `.env` files or credentials to GitHub.

### 3. Initialize the Database

Ensure PostgreSQL is running and the database exists.

Apply Prisma migrations:

```bash
npx prisma migrate deploy
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 4. Start the Backend

```bash
npm run start:dev
```

The backend runs locally at:

`http://localhost:3000`

### 5. Configure the Frontend

Open another terminal and navigate to:

```bash
cd taskflow-frontend
npm install
```

The frontend API configuration is located at:

`src/app/config/api.config.ts`

For local development, the frontend uses `http://localhost:3000` as its API base URL.

### 6. Start the Frontend

```bash
npm start
```

Open:

`http://localhost:4200`

Register an account or log in to start managing tasks.

---

## Application Workflow

1. **Register or log in** — Users authenticate using JWT.
2. **Access the dashboard** — Users view tasks permitted by their role.
3. **Create tasks** — Add new tasks to the workflow.
4. **Manage tasks** — Edit task details, change status, or delete tasks.
5. **Track progress** — Monitor tasks across the Kanban board.
6. **Persist data** — All changes are saved to PostgreSQL and remain available after refreshing or logging back in.

### Role-Based Access

| Role | Access |
|---|---|
| Admin | View and manage tasks across users |
| Member | Access and manage their own tasks |

Backend authorization ensures that users cannot access tasks outside their permitted scope.

---

## Deployment

TaskFlow is deployed using a cloud-based architecture.

### Frontend — Vercel

The Angular frontend is hosted on Vercel.

**Live URL:** https://taskflow-frontend-ashy-three.vercel.app

Build configuration:

```text
Framework: Angular
Root Directory: taskflow-frontend
Build Command: npm run build
Output Directory: dist/task-workflow/browser
```

### Backend — Render

The NestJS REST API is hosted on Render.

**API URL:** https://taskflow-backend-btx9.onrender.com

Deployment configuration:

```text
Runtime: Node.js
Root Directory: taskflow-backend/backend
Build Command: npm install --include=dev && npx prisma generate && npm run build
Start Command: npm run start:prod
```

The backend uses environment variables for its database connection, JWT secret, and frontend CORS origin.

### Database — Neon

TaskFlow uses Neon PostgreSQL for persistent cloud storage.

Prisma ORM manages database queries, relationships, and schema migrations.

Database credentials are stored securely as environment variables and are not included in the repository.

---

## Security

TaskFlow incorporates the following security measures:

- JWT-based authentication.
- Password hashing.
- Role-based authorization.
- User-specific task ownership.
- Request validation using NestJS ValidationPipe.
- Restricted CORS configuration.
- Environment-based secret management.
- PostgreSQL data persistence.

---

## Future Improvements

Potential future enhancements include:

- Task priority levels and due dates.
- Task assignment and collaboration.
- Search, filtering, and sorting.
- Email notifications and reminders.
- Activity history and audit logs.
- Analytics and reporting dashboards.
- Automated testing and CI/CD improvements.

---

## Project Highlights

TaskFlow demonstrates practical full-stack development concepts, including:

- Building a responsive Angular frontend.
- Developing REST APIs with NestJS.
- Implementing JWT authentication and role-based access.
- Managing relational data with Prisma and PostgreSQL.
- Integrating frontend and backend services.
- Deploying a complete application using Vercel, Render, and Neon.

---

## Author

**Victor Chandrasekar**

GitHub: [Victor-C04](https://github.com/Victor-C04)

---

Built with Angular, NestJS, Prisma, and PostgreSQL.