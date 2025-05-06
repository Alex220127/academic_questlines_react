import axios from 'axios'

const baseApi = axios.create({
  validateStatus: () => true,
  baseURL: 'http://localhost:3001'
})

export const apiLogin = async (payload) => {
  const { status, data } = await baseApi.post('/users/login', payload)

  return {
    success: status === 200,
    data
  }
}

export const apiSignUp = async (payload) => {
  const { status, data } = await baseApi.post('/users', payload)

  return {
    success: status === 201,
    data
  }
}
