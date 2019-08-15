import axios from 'axios/index'

const departments = '/api/account/departments/'

export function getDepList (params) {
  console.log(params)
  return axios({
    url: departments,
    method: 'get',
    params
  })
}

export function createDep (params) {
  return axios.post(departments, params)
}

export function updateDep (id, data) {
  return axios.patch(`/api/account/departments/${id}/`, data)
}

export function deleteDep (id, data) {
  return axios.delete(`/api/account/departments/${id}/`)
}
