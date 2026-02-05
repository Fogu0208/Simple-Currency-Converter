import service from './request'

// API Key 从环境变量获取
const API_KEY = import.meta.env.VITE_API_KEY

/**
 * 汇率响应接口定义
 */
export interface ExchangeRateResponse {
  result: string
  documentation: string
  terms_of_use: string
  time_last_update_unix: number
  time_last_update_utc: string
  time_next_update_unix: number
  time_next_update_utc: string
  base_code: string
  conversion_rates: Record<string, number>
}

/**
 * 获取最新汇率 (基于基础货币)
 * @param baseCode 基础货币代码，如 'USD'
 */
export const getLatestRates = (baseCode: string) => {
  return service.get<ExchangeRateResponse>(`${API_KEY}/latest/${baseCode}`)
}

/**
 * 获取支持的货币代码列表 (ExchangeRate-API 的 standard response 中包含所有支持的货币)
 * 我们可以通过一次请求获取所有 keys
 */
export const getSupportedCodes = () => {
    return service.get(`${API_KEY}/codes`)
}
