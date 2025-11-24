import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Thiết lập Service Worker với các Handlers đã định nghĩa
export const worker = setupWorker(...handlers);