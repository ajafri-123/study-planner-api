# Study Planner API

A RESTful API for managing student study plans — built with Node.js, Express, Prisma ORM, and PostgreSQL. Supports JWT-based authentication, course management, assignment tracking, and study session logging.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js >= 20 |
| Framework | Express.js v4 |
| Database | PostgreSQL |
| ORM | Prisma v5 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| API Docs | Swagger UI |
| Deployment | Render |

---

## Project Structure

```
study-planner-api/
├── prisma/
│   ├── schema.prisma       # Database models
│   └── seed.js             # Seed script
├── src/
│   ├── lib/
│   │   └── prisma.js       # Prisma client singleton
│   ├── middleware/         # Auth & error middleware
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── courses.routes.js
│   │   ├── assignments.routes.js
│   │   └── studySessions.routes.js
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   └── swagger.js          # Swagger/OpenAPI config
├── .env                    # Environment variables (not committed)
├── package.json
└── render.yaml             # Render deployment config
```

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| id | Int | Auto-increment PK |
| email | String | Unique |
| password_hash | String | bcrypt hashed |
| full_name | String | |
| role | String | `student` (default) or `admin` |
| created_at | DateTime | |

### Course
| Field | Type | Notes |
|---|---|---|
| id | Int | Auto-increment PK |
| user_id | Int | FK → User |
| course_code | String | e.g. ITSC-3155 |
| title | String | |
| semester | String | e.g. Fall 2025 |
| instructor_name | String? | Optional |

### Assignment
| Field | Type | Notes |
|---|---|---|
| id | Int | Auto-increment PK |
| course_id | Int | FK → Course |
| user_id | Int | FK → User |
| title | String | |
| description | String? | Optional |
| due_date | DateTime | |
| status | String | `pending` (default) |
| priority | String? | Optional |

### StudySession
| Field | Type | Notes |
|---|---|---|
| id | Int | Auto-increment PK |
| assignment_id | Int | FK → Assignment |
| user_id | Int | FK → User |
| session_date | DateTime | |
| duration_minutes | Int | |
| location | String? | Optional |
| notes | String? | Optional |
| completed | Boolean | `false` by default |

---

## API Endpoints

All protected routes require a `Bearer` token in the `Authorization` header.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | None | Register a new user |
| POST | `/api/auth/login` | None | Login and receive JWT |

### Courses — `/api/courses`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/courses` | Required | Get all courses for current user |
| POST | `/api/courses` | Required | Create a new course |
| GET | `/api/courses/:id` | Required | Get a specific course |
| PUT | `/api/courses/:id` | Required | Update a course |
| DELETE | `/api/courses/:id` | Required | Delete a course |

### Assignments — `/api/assignments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/assignments` | Required | Get all assignments for current user |
| POST | `/api/assignments` | Required | Create a new assignment |
| GET | `/api/assignments/:id` | Required | Get a specific assignment |
| PUT | `/api/assignments/:id` | Required | Update an assignment |
| DELETE | `/api/assignments/:id` | Required | Delete an assignment |

### Study Sessions — `/api/study-sessions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/study-sessions` | Required | Get all study sessions for current user |
| POST | `/api/study-sessions` | Required | Log a new study session |
| GET | `/api/study-sessions/:id` | Required | Get a specific session |
| PUT | `/api/study-sessions/:id` | Required | Update a session |
| DELETE | `/api/study-sessions/:id` | Required | Delete a session |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ajafri-123/study-planner-api.git
cd study-planner-api

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret-key"
PORT=3000
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run seed
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.

---

## API Documentation

Interactive Swagger docs are available at:

```
http://localhost:3000/api-docs
```

---

## Example Usage

### Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "student@example.com", "password": "secret123", "full_name": "Jane Doe"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@example.com", "password": "secret123"}'
```

### Create a Course (with token)

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"course_code": "ITSC-3155", "title": "Software Engineering", "semester": "Fall 2025"}'
```

---

## Deployment

This project includes a `render.yaml` config for one-click deployment to [Render](https://render.com). Make sure to set the `DATABASE_URL` and `JWT_SECRET` environment variables in your Render service settings.

---

## License

ISC
