import axios, { AxiosInstance, AxiosError } from 'axios'
import { AppError } from '@utils/AppError'
import { storageAuthTokenGet, storageAuthTokenSave } from '@storage/storageAuthToken';

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
  // configurações de conexão com a API
  baseURL: 'http://192.168.0.233:3333'
}) as APIInstanceProps

let failedQueue: Array<PromiseType> = []
let isRefreshing = false
 
api.registerInterceptTokenManager = signOut => {
  const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {
    if (requestError?.response?.status === 401) {
      if (requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
        const { refresh_token } = await storageAuthTokenGet()

        if (!refresh_token) {
          signOut()
          return Promise.reject(requestError)
        }

        // todas as informações da requisição que foi feita
        const originalRequestConfig = requestError.config

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              onSuccess: (token: string) => {
                originalRequestConfig.headers = {'Authorization': `Bearer ${token}`}
                resolve(api(originalRequestConfig))
              },
              onFailure: (error: AxiosError) => {
                reject(error)
              }
            })
          })
        }

        isRefreshing = true

        return new Promise(async (resolve, reject) => {
          try {
            const { data } = await api.post('/sessions/refresh-token', {refresh_token})
            await storageAuthTokenSave({token: data.token, refresh_token: data.refresh_token})

            if (originalRequestConfig.data) {
              originalRequestConfig.data = JSON.parse(originalRequestConfig.data)
            }

            originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` }
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

            failedQueue.forEach(request => {
              request.onSuccess(data.token)
            })
            
            resolve(api(originalRequestConfig))

          } catch (error: any) {
            failedQueue.forEach(request => {
              request.onFailure(error)
            })

            signOut()
            reject(error)

          } finally {
            isRefreshing = false
            failedQueue = []
          }
        })

      }

      signOut()
    }


    // erro não relacionado ao token
    if (requestError.message && requestError.response.data) {
      return Promise.reject(new AppError(requestError.response.data.message))
    } else {
      return Promise.reject(requestError)
    }
  })

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

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


export { api }