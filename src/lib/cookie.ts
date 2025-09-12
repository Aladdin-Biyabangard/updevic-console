import Cookies from 'js-cookie'

export const AUTH_TOKEN_KEY = 'auth_token'

export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: 1, // 1 day
    httpOnly: false, // Cannot use httpOnly in client-side cookies, but this adds awareness
    secure: window.location.protocol === 'https:', // Only secure in HTTPS
    sameSite: 'strict'
  })
}

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY)
}

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY)
}