/**
 * Konstanta untuk API
 */

const env = import.meta.env;

if (!env.VITE_API_URL) {
  throw new Error('VITE_API_URL belum diset di .env');
}
if (!env.VITE_API_KEY) {
  throw new Error('VITE_API_KEY belum diset di .env');
}

const BASE_URL = env.VITE_API_URL;

export const API_BASE_URL = `${BASE_URL}/api`;
export const STORAGE_BASE_URL = `${BASE_URL}/storage`;
export const API_KEY = env.VITE_API_KEY;
