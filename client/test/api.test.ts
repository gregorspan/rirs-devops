import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '@/lib/api';

const mockFetch = vi.fn();

describe('api client', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    // @ts-expect-error - allow test double assignment
    global.fetch = mockFetch;
  });

  it('fetches todos successfully', async () => {
    const todos = [{ id: 1, title: 'Test', description: '', completed: false, created_at: 'now' }];
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(todos) });

    const result = await getTodos();

    expect(result).toEqual(todos);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/todos');
  });

  it('throws when fetching todos fails', async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(getTodos()).rejects.toThrow('Failed to fetch todos');
  });

  it('creates todo with correct payload', async () => {
    const newTodo = { title: 'New', description: 'Desc' };
    const created = { ...newTodo, id: 99, completed: false, created_at: 'now' };
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(created) });

    const result = await createTodo(newTodo);

    expect(result).toEqual(created);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/todos', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  it('fails deleting todo when server responds with error', async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(deleteTodo(1)).rejects.toThrow('Failed to delete todo');
  });
});


