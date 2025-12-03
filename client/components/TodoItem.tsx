'use client';

import { Todo } from '@/lib/types';
import { updateTodo, deleteTodo } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const handleToggle = async () => {
    await updateTodo(todo.id, { completed: !todo.completed });
    onUpdate();
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id);
    onUpdate();
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-4 p-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
        />
        <div className="flex-1">
          <h3
            className={`text-lg font-medium ${
              todo.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`text-sm text-muted-foreground ${
                todo.completed ? 'line-through' : ''
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

