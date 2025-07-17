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

  console.log(data)

  return {
    success: status === 201,
    data
  }
}

export const apiGetQuestlineRegister = async (token) => {
  const { status, data } = await baseApi.get('/questline-register', { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 200,
    data
  }
}

export const apiGetRegisteDetails = async (register, token) => {
  const { status, data } = await baseApi.get(`/questline-register/${register}`, { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 200,
    data
  }
}

export const updateNodeStatus = async (questlineRegister, node, newStatus, token) => {
  const { status } = await baseApi.put(`/questline-register/${questlineRegister}/nodes/${node}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 204
  }
}

export const joiToQuestline = async (code, token) => {
  const { status, data } = await baseApi.post('/users/questline-register', { short_code: code }, { headers: { Authorization: `Bearer ${token}` } })
  return {
    success: status === 204,
    data
  }
}

export const getStore = async (token) => {
  const { status, data } = await baseApi.get('/items', { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 200,
    data
  }
}

export const getBalance = async (user, token) => {
  const { status, data } = await baseApi.get(`/users/${user}/balance`, { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 200,
    data
  }
}

export const redeemReward = async (user, item, token) => {
  const body = {
    user_id: user.user_id
  }

  const { status, data } = await baseApi.put(`/items/${item}/redeem`, body, { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 204,
    data
  }
}

export const getInventory = async (user, token) => {
  const { status, data } = await baseApi.get(`/users/${user.user_id}/inventory`, { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 200,
    data
  }
}

export const createQuestline = async (questline, token) => {
  const { status, data } = await baseApi.post('/questlines', questline, { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 201,
    data
  }
}

export const getQuestlines = async (token) => {
  const { status, data } = await baseApi.get('/questlines', { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 200,
    data
  }
}

export const shareQuestline = async (questline, token) => {
  const { status, data } = await baseApi.get(`/questlines/${questline}/share-link`, { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 200,
    data
  }
}

export const getQuestlineReport = async (token, questline) => {
  const qs = new URLSearchParams({})

  if (questline) {
    qs.append('questline_id', questline)
  }

  const { status, data } = await baseApi.get(`/questline/report?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })

  return {
    success: status === 200,
    data
  }
}
