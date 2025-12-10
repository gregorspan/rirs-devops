import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '@/components/TodoForm';

vi.mock('@/lib/api', () => ({
  createTodo: vi.fn(),
}));

const { createTodo } = await import('@/lib/api');

describe('TodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prevents submission when title is empty', async () => {
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);

    await userEvent.click(screen.getByRole('button', { name: /add todo/i }));

    expect(createTodo).not.toHaveBeenCalled();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('creates todo and resets inputs', async () => {
    const onAdd = vi.fn();
    (createTodo as unknown as vi.Mock).mockResolvedValue({ id: 1 });
    render(<TodoForm onAdd={onAdd} />);

    await userEvent.type(screen.getByPlaceholderText(/todo title/i), '  Test todo  ');
    await userEvent.type(screen.getByPlaceholderText(/description/i), ' Details ');
    await userEvent.click(screen.getByRole('button', { name: /add todo/i }));

    await waitFor(() => expect(createTodo).toHaveBeenCalledWith({
      title: 'Test todo',
      description: 'Details',
    }));
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(screen.getByPlaceholderText(/todo title/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/description/i)).toHaveValue('');
  });
});


