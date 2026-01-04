import '@testing-library/jest-dom';

// Set NODE_ENV for tests if not already set
if (!process.env.NODE_ENV) {
  (process.env as { NODE_ENV?: string }).NODE_ENV = 'test';
}


