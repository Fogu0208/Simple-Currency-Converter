import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

/**
 * 封装 Axios 实例
 * 包含请求和响应拦截器，统一处理错误
 */
const service: AxiosInstance = axios.create({
  baseURL: 'https://v6.exchangerate-api.com/v6/', // 基础 URL
  timeout: 10000, // 请求超时时间 (10秒)
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response
  },
  (error) => {
    // 对响应错误做点什么
    console.error('API Error:', error)
    // 使用 Element Plus 的 Message 组件提示错误
    ElMessage.error(error.message || '网络请求失败，请稍后重试')
    return Promise.reject(error)
  }
)

export default service
