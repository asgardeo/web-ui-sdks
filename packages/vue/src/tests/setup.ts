// src/tests/setup.ts
import { vi } from 'vitest';

// Mock entire window object
global.window = {
  location: {
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    href: 'http://localhost:3000/',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000'
  }
} as any;

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
} as any;

// Mock sessionStorage
global.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
} as any;

// Mock document
global.document = {
  ...global.document
} as any;