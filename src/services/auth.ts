import { useAuthStore } from '@/stores/authStore'
// import { API } from '@/constant/routes'
// import axios from 'axios'

// export const login = async (email: string, password: string) => {
//   const res = await axios.post(API.login, { email, password })
//   const { user, accessToken, refreshToken } = res.data
//   useAuthStore.getState().setAuth(user, accessToken, refreshToken)
//   return res.data
// }

// export const refreshToken = async () => {
//   const { refreshToken } = useAuthStore.getState()
//   if (!refreshToken) throw new Error('No refresh token')

//   try {
//     const res = await axios.post(API.refresh, { refreshToken })
//     const { accessToken } = res.data
//     useAuthStore.setState({ accessToken })
//     return accessToken
//   } catch (err) {
//     useAuthStore.getState().clearAuth()
//     throw err
//   }
// }

export const login = async (email: string, password: string) => {
  // simulasi login (dummy)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@example.com' && password === '123456') {
        const fakeUser = {
          userId: '1',
          namaUser: 'Admin Demo',
          email,
        }
        const fakeAccessToken = 'fake-access-token-123'
        const fakeRefreshToken = 'fake-refresh-token-123'

        // simpan ke store
        useAuthStore.getState().setAuth(fakeUser, fakeAccessToken, fakeRefreshToken)

        resolve({
          user: fakeUser,
          accessToken: fakeAccessToken,
          refreshToken: fakeRefreshToken,
        })
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 800) // delay biar mirip API call
  })
}

export const refreshToken = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { refreshToken } = useAuthStore.getState()
      if (!refreshToken) {
        reject(new Error('No refresh token'))
      } else {
        const newAccessToken = 'new-fake-access-token-' + Date.now()
        useAuthStore.setState({ accessToken: newAccessToken })
        resolve(newAccessToken)
      }
    }, 500)
  })
}
