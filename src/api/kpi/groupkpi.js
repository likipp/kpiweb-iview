import axios from 'axios/index'

const groupkpi = '/api/kpimng/groupkpi/'

export function getGroupKpiList (params) {
  return axios({
    url: groupkpi,
    method: 'get',
    params
  })
}

export function createGroupList (params) {
  return axios.post(groupkpi, params)
}

export function updateGroupKpi (id, data) {
  return axios({
    url: `/api/kpimng/groupkpi/${id}/`,
    method: 'patch',
    data
  })
}

export function deleteGroupKpi (id, data) {
  return axios.delete(`/api/kpimng/groupkpi/${id}/`)
}
