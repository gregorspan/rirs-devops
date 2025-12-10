import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '@/components/TodoItem';
import { Todo } from '@/lib/types';

vi.mock('@/lib/api', () => ({
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

const { updateTodo, deleteTodo } = await import('@/lib/api');

const baseTodo: Todo = {
  id: 1,
  title: 'Test todo',
  description: 'Details',
  completed: false,
  created_at: 'today',
};

describe('TodoItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles completion state', async () => {
    const onUpdate = vi.fn();
    (updateTodo as unknown as vi.Mock).mockResolvedValue({});
    render(<TodoItem todo={baseTodo} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => expect(updateTodo).toHaveBeenCalledWith(1, { completed: true }));
    expect(onUpdate).toHaveBeenCalled();
  });

  it('deletes todo', async () => {
    const onUpdate = vi.fn();
    (deleteTodo as unknown as vi.Mock).mockResolvedValue({});
    render(<TodoItem todo={baseTodo} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(deleteTodo).toHaveBeenCalledWith(1));
    expect(onUpdate).toHaveBeenCalled();
  });
});


