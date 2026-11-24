/**
 * Konstanta untuk API.
 *
 * Runtime values come from /config.js (window.__ENV__) so one image can serve
 * dev and prod. Falls back to Vite env vars for `npm run dev`.
 */

type RuntimeEnv = {
  VITE_API_URL?: string;
  VITE_API_KEY?: string;
};

const runtime = (window as { __ENV__?: RuntimeEnv }).__ENV__ ?? {};
const env = import.meta.env;

const BASE_URL = runtime.VITE_API_URL || env.VITE_API_URL;
const KEY = runtime.VITE_API_KEY || env.VITE_API_KEY;

if (!BASE_URL) {
  throw new Error('VITE_API_URL tidak tersedia (config.js atau .env)');
}
if (!KEY) {
  throw new Error('VITE_API_KEY tidak tersedia (config.js atau .env)');
}

export const API_BASE_URL = `${BASE_URL}/api`;
export const STORAGE_BASE_URL = `${BASE_URL}/storage`;
export const ADMIN_BASE_URL = BASE_URL;
export const API_KEY = KEY;
