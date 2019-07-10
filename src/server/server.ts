import axios from 'axios'
import Cookies from 'js-cookie'
import {
  Message
} from 'element-ui'

interface ResInterface<T = any> {
  returnCode: number
  returnMsg: string
  success: string
  data: T
}

let promiseArr: any = {}
const insurance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: process.env.VUE_APP_DOMAIN
})
insurance.interceptors.request.use(config => {
  config.headers.Authorization = localStorage.getItem('Authorization')
  config.url = config.url + ';JSESSIONID=' + getSessionid()
  // 发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = null
  }
  return config
}, error => {
  return Promise.reject(error)
})
export const server = {
  get(url: string, params = {}) {
    return new Promise((resolve, reject) => {
      insurance.get(url, params)
        .then((res) => {
          if (res) {
            const {
              returnMsg,
              returnCode,
              success
            } = res.data
            if (returnCode === 10000 || success === 'false') {
              resolve(res.data)
            } else {
              Message({
                showClose: true,
                message: returnMsg,
                type: 'error'
              })
            }
          }
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  },
  post<T>(url: string, data = {}, flag?: boolean, filterNullString = true): Promise<ResInterface<T>> {
    return new Promise((resolve, reject) => {
      if (data) {
        data = filterNullValue(data, filterNullString)
      }
      insurance.post(url, data)
        .then((res) => {
          if (res) {
            const {
              returnCode,
              success,
              returnMsg
            } = res.data
            if (returnCode === 10000 || success === 'true') {
              resolve(res.data)
            } else if (returnCode !== 901 && returnCode !== 503) {
              resolve(res.data)
              if (flag) {
                return
              }
              Message({
                showClose: true,
                // message: url + "；接口错误；" + returnMsg,
                message: returnMsg,
                type: 'error'
              })
            }
          }
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  }
}

export function getSessionid() {
  // return sessionStorage.getItem('sessionid') || ''
  return Cookies.get('web-sessionid') || ''
}

function filterNullValue(data: any, filterNullString = true) {
  let newParams: any = {}
  const allParams = data
  for (let item in allParams) {
    const check = Object.prototype.toString.call(allParams[item])
    // console.log(check)
    if (!(check === '[object Null]' || check === '[object Undefined]')) {
      if (!(filterNullString && allParams[item] === '')) {
        newParams[item] = allParams[item]
      }
    }
  }
  return newParams
}
