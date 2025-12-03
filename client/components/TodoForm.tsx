'use client';

import { useState } from 'react';
import { createTodo } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TodoFormProps {
  onAdd: () => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createTodo({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      onAdd();
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !title.trim()}>
            {loading ? 'Adding...' : 'Add Todo'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

