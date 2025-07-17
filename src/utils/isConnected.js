export const isConnected = () => {
  const user = localStorage.getItem('user')
  const token = localStorage.getItem('token')

  if (!user || !token) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    return null
  }

  return { token, user: JSON.parse(user) }
}
