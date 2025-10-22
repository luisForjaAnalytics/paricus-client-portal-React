

/**
 *
 * @param {string} token -  JWT.
 * @returns {object|null} - payload.
 */
export const decodeToken = (token) => {
  if (!token) return null
  try {
    const payloadBase64 = token.split('.')[1]
    const decodedPayload = atob(payloadBase64)
    return JSON.parse(decodedPayload)
  } catch (error) {
    console.warn('Error decoding token:', error)
    return null
  }
}

/**
 *
 * @param {string} token - JWT.
 * @returns {number|null} - Timestamp .
 */
export const getTokenExpiry = (token) => {
  const payload = decodeToken(token)
  return payload?.exp || null
}

/**
 * 
 * @param {number|string|null} expiry - Timestamp.
 * @returns {boolean} - true si está expirado o no válido.
 */
export const isTokenExpired = (expiry) => {
  if (!expiry) return true

  const expiryInt =
    typeof expiry === 'string' ? parseInt(expiry, 10) : expiry

  if (Number.isNaN(expiryInt)) return true

  const now = Math.floor(Date.now() / 1000) // segundos actuales
  return now >= expiryInt
}

/**
 * @returns {boolean} - true si es válido, false si está expirado o faltante.
 */
export const hasValidStoredToken = () => {
  const token = localStorage.getItem('token')
  const tokenExpiryStr = localStorage.getItem('tokenExpiry')

  if (!token || !tokenExpiryStr) return false

  return !isTokenExpired(parseInt(tokenExpiryStr))
}
