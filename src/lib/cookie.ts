import Cookies from 'js-cookie'

export const AUTH_TOKEN_KEY = 'auth_token'

export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: 1, // 1 day
    secure: true,
    sameSite: 'strict'
  })
}

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY)
}

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY)
}