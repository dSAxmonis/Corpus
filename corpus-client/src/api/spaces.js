import api from './axios.js'

export async function fetchSpaces() {
  const { data } = await api.get('/spaces')
  return data
}

export async function fetchSpace(id) {
  const { data } = await api.get(`/spaces/${id}`)
  return data
}

export async function createSpace(payload) {
  const { data } = await api.post('/spaces', payload)
  return data
}

export async function updateSpace(id, payload) {
  const { data } = await api.patch(`/spaces/${id}`, payload)
  return data
}

export async function deleteSpace(id) {
  const { data } = await api.delete(`/spaces/${id}`)
  return data
}
