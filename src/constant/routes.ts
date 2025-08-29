const MODE = import.meta.env.VITE_MODE || 'development'
const BASE_URL =
  MODE === 'production' ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_BASE_URL_DEV

export const API = {
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  refresh: `${BASE_URL}/auth/refresh-token`,
}
