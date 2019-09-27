import axios from 'axios/index'

axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded'

const departments = '/api/account/departments/'

export function getDepList (params) {
  return axios({
    url: departments,
    method: 'get',
    params
  })
}

export function createDep (params) {
  console.log(params, 77777)
  return axios.post(departments, params)
}

export function updateDep (id, data) {
  return axios.patch(`/api/account/departments/${id}/`, data)
}

export function deleteDep (id, data) {
  return axios.delete(`/api/account/departments/${id}/`)
}
