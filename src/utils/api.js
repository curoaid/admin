import axios from 'axios'
import { toast } from 'react-toastify'
import Qs from 'qs'

const pendingRequest = new Map()
console.log('LiveUrlSetup')
var BASE_URL = ''

var setupAPI = function () {
   console.log('process.env.REACT_APP_STAGE', process.env.REACT_APP_STAGE)

   switch (process.env.REACT_APP_STAGE) {
      case 'production':
         // BASE_URL = 'http://192.168.1.116:3001/admin/'
         //BASE_URL = 'http://13.235.67.131:4032/api/';
         // BASE_URL = 'http://192.168.0.109:3001/admin/';
         // BASE_URL = 'http://52.66.187.242:3001/admin/'
         // BASE_URL = 'http://43.204.84.242:3001/admin/'
         BASE_URL = 'https://api.vathala.com/admin/'

         break
      case 'staging':
         // BASE_URL = 'http://192.168.1.116:3001/admin/'
         // BASE_URL = 'http://192.168.0.109:3001/admin/';
         // BASE_URL = 'http://43.204.84.242:3001/admin/'
         break
      case 'development':
         // BASE_URL = 'http://192.168.1.116:3001/admin/'
         // BASE_URL = 'http://192.168.0.109:3001/admin/';
         // BASE_URL = 'http://43.204.84.242:3001/admin/'
         break
      default:
         //    BASE_URL = 'http://192.168.0.109:3001/admin/';
         // BASE_URL = 'http://192.168.1.116:3001/admin/';
         // BASE_URL = 'http://localhost:3001/admin/';
         // BASE_URL = 'http://43.204.84.242:3001/admin/';
         // BASE_URL = 'http://52.66.187.242:3001/admin/'
         BASE_URL = 'https://api.vathala.com/admin/'
         break
   }
}

setupAPI()

function generateReqKey(config) {
   const { method, url, params, data } = config
   return [method, url, Qs.stringify(params), Qs.stringify(data)].join('&')
}

function addPendingRequest(config) {
   const requestKey = generateReqKey(config)
   config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
         if (!pendingRequest.has(requestKey)) {
            pendingRequest.set(requestKey, cancel)
         }
      })
}

function removePendingRequest(config) {
   const requestKey = generateReqKey(config)
   if (pendingRequest.has(requestKey)) {
      const cancelToken = pendingRequest.get(requestKey)
      cancelToken(requestKey)
      pendingRequest.delete(requestKey)
   }
}

const fetchClient = () => {
   const defaultOptions = {
      baseURL: BASE_URL,
      // timeout: 20000,
      headers: {
         'Content-Type': 'application/json',
      },
   }

   // Create instance
   let instance = axios.create(defaultOptions)
   // instance.defaults.timeout = 30000
   // instance.defaults.timeoutErrorMessage = 'timeout'
   instance.interceptors.response.use(
      function (response) {
         removePendingRequest(response.config) // Remove the request from the pendingRequest object
         return response.data
      },
      function (error) {
         removePendingRequest(error.config || {}) // Remove the request from the pendingRequest object
         toast.dismiss()
         if (error.code === 'ECONNABORTED') {
            // Timeout error
            toast.success('Something went wrong...')
         } else if (error.response.status === 401) {
            localStorage.clear()
         }
         return Promise.reject(error.response.data)
      },
   )

   // Set the AUTH token for any request
   instance.interceptors.request.use(
      function (config) {
         const token = localStorage.getItem('token')
         if (!!token && token !== 'null') {
            config.headers.access_token = token ? ` ${token}` : `Bearer ''`
         }

         // Timeout
         config.timeout = 30000 // Milliseconds

         removePendingRequest(config) // Check whether there is a duplicate request, if so, cancel the request
         addPendingRequest(config) // Add the current request information to the pendingRequest object

         return config
      },
      function (error) {
         // Do something with request error
         return Promise.reject(error)
      },
   )

   return instance
}

export default fetchClient()