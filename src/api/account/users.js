import axios from 'axios/index'

axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded'

const users = '/api/account/users/'

export function getUsersList (params) {
  return axios({
    url: users,
    method: 'get',
    params
  })
}

export function createUser (params) {
  return axios.post(users, params)
}

export function updateUser (id, data) {
  // return axios.patch(`/api/account/users/${id}/`, data)
  return axios({
    url: `/api/account/users/${id}/`,
    method: 'patch',
    data
  })
}

export function deleteUser (id, data) {
  return axios.delete(`/api/account/users/${id}/`)
}

const authUrl = '/api/api-token-auth/'

export function Login (data) {
  return axios({
    url: authUrl,
    method: 'post',
    data: data
  })
}
