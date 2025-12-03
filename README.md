# Todo App

A simple todo application with a separate FastAPI backend and Next.js frontend using shadcn/ui.

## Project Structure

```
.
├── server/          # FastAPI backend
└── client/          # Next.js frontend with shadcn/ui
```

## Getting Started

### Backend (FastAPI)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000
API documentation available at http://localhost:8000/docs

### Frontend (Next.js)

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Features

- Create todos with title and optional description
- Mark todos as complete/incomplete
- Delete todos
- Real-time updates
- Beautiful UI with shadcn/ui components

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo

