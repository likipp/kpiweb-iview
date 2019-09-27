import axios from 'axios/index'

const groups = '/api/account/groups/'

export function getGroupsList (params) {
  return axios({
    url: groups,
    method: 'get',
    params
  })
}

export function deleteGroup (id, data) {
  return axios.delete(`/api/account/groups/${id}/`)
}
