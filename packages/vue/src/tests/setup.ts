import { vi } from 'vitest';

// Ensure global.window exists before proceeding
if (typeof window === 'undefined') {
  (global as any).window = {};
}

// Mock window object properties
(global as any).window = {
  location: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000/',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn()
  },
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  sessionStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  crypto: {
    getRandomValues: vi.fn((buffer) => buffer)
  }
} as any;

global.window = (global as any).window;
global.location = global.window.location;
