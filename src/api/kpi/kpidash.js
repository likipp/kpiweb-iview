import axios from 'axios/index'

const data = '/api/kpimng/kpidash/'

export function selectData (params) {
  return axios.post(data, params)
}
