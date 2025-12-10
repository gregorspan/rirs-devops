import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names and removes duplicates', () => {
    const result = cn('p-2', 'text-lg', 'p-2', { hidden: false, flex: true });
    const classes = result.split(' ');
    expect(classes).toHaveLength(3);
    expect(classes).toEqual(expect.arrayContaining(['p-2', 'text-lg', 'flex']));
  });

  it('handles falsy values gracefully', () => {
    const result = cn(undefined, null, '', false, 'block');
    expect(result).toBe('block');
  });
});


