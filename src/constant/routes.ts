const MODE = import.meta.env.VITE_MODE || 'development'
export const BASE_URL =
  MODE === 'production' ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_BASE_URL_DEV

export const AUTH_URL =
  MODE === 'production' ? import.meta.env.VITE_AUTH_URL : import.meta.env.VITE_AUTH_URL_DEV

export const API = {
  Login: `${AUTH_URL}/realms/AdsPay/protocol/openid-connect/token`,
  RefreshToken: `${AUTH_URL}/realms/AdsPay/protocol/openid-connect/token`,
  Logout: `${AUTH_URL}/realms/AdsPay/protocol/openid-connect/revoke`,
  GetAllCustomer: `${BASE_URL}/customer/getAllCustomer`,
}
