'use client';

import { useEffect, useState } from 'react';
import { Todo } from '@/lib/types';
import { getTodos } from '@/lib/api';
import { TodoForm } from '@/components/TodoForm';
import { TodoItem } from '@/components/TodoItem';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Make sure the server is running on http://localhost:8000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Todo App</h1>
          <p className="text-muted-foreground">
            A simple todo application with Next.js and FastAPI
          </p>
        </div>

        <TodoForm onAdd={fetchTodos} />

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-muted-foreground">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No todos yet. Add one above to get started!
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Todos ({todos.length})</h2>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
