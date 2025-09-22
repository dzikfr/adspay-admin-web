export function redirectToLogin() {
  const url = new URL(
    `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/auth`
  )

  url.searchParams.set('client_id', import.meta.env.VITE_KEYCLOAK_CLIENT)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid profile email')
  url.searchParams.set('redirect_uri', window.location.origin + '/callback')

  window.location.href = url.toString()
}
