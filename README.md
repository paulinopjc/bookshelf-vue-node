# Bookshelf

A full-stack book tracking app. Add books, mark them as unread/reading/finished, rate and review finished books, search and filter your collection, and view reading stats.

Built with a REST API backend (Express + TypeScript + PostgreSQL) and a Vue 3 SPA frontend (Composition API + Pinia + Tailwind CSS).

**Live:** [bookshelf-vue-node.vercel.app](https://bookshelf-vue-node.vercel.app)
**API:** [bookshelf-api-c0w8.onrender.com](https://bookshelf-api-c0w8.onrender.com)

## Tech Stack

### Backend
- **Express 5** with TypeScript
- **PostgreSQL** via node-postgres (pg), Neon for production
- **Zod v4** for request validation
- **Jest + Supertest** for API tests (100% endpoint coverage)
- **Morgan** for request logging

### Frontend
- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** for state management
- **Vue Router** for client-side routing
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Vitest + Vue Test Utils** for component tests
- **Vite** for dev server and production builds

## Project Structure

```
bookshelf-vue-node/
  docker-compose.yml        # Local PostgreSQL
  backend/
    src/
      controllers/          # Route handlers (books)
      db/                   # PostgreSQL connection + migrations
      middleware/           # Error handling, validation
      routes/               # Express route definitions
      services/             # Business logic (bookService)
      types/                # TypeScript types
      validators/           # Zod schemas
      app.ts                # Express app factory
      server.ts             # Entry point
    tests/                  # Jest API tests
  frontend/
    src/
      api/                  # Axios client + book API functions
      components/           # Vue components (BookCard, BookForm, StatsBar, etc.)
      composables/          # Reusable composition functions
      router/               # Vue Router config
      stores/               # Pinia stores (books)
      types/                # TypeScript types + shared constants
      views/                # Page components (BookList, BookCreate, BookEdit)
      App.vue               # Root component
      main.ts               # App entry point
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/books | List all books (supports `?status=`, `?q=` filters) |
| GET | /api/books/stats | Reading stats (totals, by status, average rating) |
| GET | /api/books/:id | Get a single book |
| POST | /api/books | Create a book |
| PATCH | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |

## Documentation

**Postman documentation:**

[View API Docs on Postman](https://documenter.getpostman.com/view/53937112/2sBXqDt3WY)

Import `bookshelf-api.postman_collection.json` into Postman to test all endpoints locally. Set the `base_url` variable to `http://localhost:4001` for local development or `https://bookshelf-api-c0w8.onrender.com` for production.

## Getting Started

### Prerequisites
- Node.js 20+
- npm
- Docker (for local PostgreSQL)

### Backend

```bash
# Start PostgreSQL
docker compose up -d

cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

The API runs at `http://localhost:4001`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

### Run Tests

```bash
# Backend (Jest)
cd backend
npm test

# Frontend (Vitest)
cd frontend
npm test
```

### Production Build

```bash
# Backend
cd backend
npm run build
NODE_ENV=production node dist/server.js

# Frontend
cd frontend
npm run build
npm run preview    # Preview at http://localhost:4173
```

## Deployment

- **Backend:** Render (Web Service, root directory: `backend`)
- **Frontend:** Vercel (root directory: `frontend`, framework: Vue/Vite)
- **Database:** Neon PostgreSQL (free tier)

## Features

- Add, edit, and delete books
- Track reading status (unread, reading, finished)
- Rate and review finished books (1-5 stars)
- Search by title or author with debounced input
- Filter by reading status
- Dashboard stats: total books, books by status, finished this year, average rating
- Validation on both frontend and backend (Zod schemas)
- Responsive design (mobile-friendly)

## License

MIT
