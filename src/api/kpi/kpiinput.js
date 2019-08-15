import axios from 'axios/index'

const data = '/api/kpimng/kpiinput/'

export function getInputList (params) {
  return axios({
    url: data,
    method: 'get',
    params
  })
}

export function createInput (params) {
  return axios.post(data, params)
}
