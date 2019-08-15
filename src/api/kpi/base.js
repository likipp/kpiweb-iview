import axios from 'axios/index'

// 以/开头,以/结尾
const kpi = '/api/kpimng/kpi/'

export function getKpiList (params) {
  return axios({
    url: kpi,
    method: 'get',
    params
  })
}

export function createKpi (params) {
  return axios.post(kpi, params)
}

export function updateKpi (id, data) {
  return axios({
    url: `/api/kpimng/kpi/${id}/`,
    method: 'patch',
    data
  })
}

export function deleteKpi (id, data) {
  return axios.delete(`/api/kpimng/kpi/${id}/`)
}
