import axios from 'axios'
import { AppError } from '@utils/AppError'

const api = axios.create({
  // configurações de conexão com a API
  baseURL: 'http://192.168.0.233:3333'
})

// interceptando todas as requisições que serão feitas para o backend
// se der sucesso passa pelo primeiro parâmetro (config tem todas as infos da req)
/* api.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
}) */

/* api.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
}) */

api.interceptors.response.use(response => response, error => {
  if (error.message && error.response.data) {
    return Promise.reject(new AppError(error.response.data.message))
  } else {
    return Promise.reject(error)
  }
})

export { api }