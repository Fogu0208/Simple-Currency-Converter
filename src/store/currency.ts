import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLatestRates } from '../api/exchange'

// 定义历史记录接口
export interface HistoryItem {
  id: number
  from: string
  to: string
  amount: number
  result: number
  rate: number
  date: string
}

export const useCurrencyStore = defineStore('currency', () => {
  // --- 状态 (State) ---
  
  // 基础货币
  const baseCurrency = ref('USD')
  // 目标货币
  const targetCurrency = ref('CNY')
  // 汇率缓存
  const rates = ref<Record<string, number>>({})
  // 转换历史记录
  const history = ref<HistoryItem[]>([])
  // 收藏的货币对 (格式: "USD-CNY")
  const favorites = ref<string[]>([])
  // 支持的货币列表 (简单的 key-value 映射或仅 keys)
  const currencyList = ref<string[]>([])

  // --- 初始化逻辑 ---
  const init = () => {
    // 从 LocalStorage 读取历史记录
    const savedHistory = localStorage.getItem('currency_history')
    if (savedHistory) history.value = JSON.parse(savedHistory)
    
    // 从 LocalStorage 读取收藏
    const savedFavorites = localStorage.getItem('currency_favorites')
    if (savedFavorites) favorites.value = JSON.parse(savedFavorites)
  }
  
  // 调用初始化
  init()

  // --- 动作 (Actions) ---

  /**
   * 获取指定基础货币的汇率数据
   * @param base 基础货币代码
   */
  const fetchRates = async (base: string) => {
    try {
      const res = await getLatestRates(base)
      if (res.data.result === 'success') {
        rates.value = res.data.conversion_rates
        // 如果货币列表为空，初始化一下
        if (currencyList.value.length === 0) {
            currencyList.value = Object.keys(res.data.conversion_rates)
        }
      }
    } catch (error) {
      console.error('Fetch rates failed', error)
      throw error
    }
  }

  /**
   * 添加转换历史记录
   * @param item 历史记录项
   */
  const addHistory = (item: Omit<HistoryItem, 'id'>) => {
    const newItem = { ...item, id: Date.now() }
    history.value.unshift(newItem)
    // 保持最近 5 条
    if (history.value.length > 5) {
      history.value.pop()
    }
    // 持久化
    localStorage.setItem('currency_history', JSON.stringify(history.value))
  }

  /**
   * 切换收藏状态
   * @param from 源货币
   * @param to 目标货币
   */
  const toggleFavorite = (from: string, to: string) => {
    const key = `${from}-${to}`
    const index = favorites.value.indexOf(key)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(key)
    }
    localStorage.setItem('currency_favorites', JSON.stringify(favorites.value))
  }

  /**
   * 检查是否已收藏
   */
  const isFavorite = (from: string, to: string) => {
    return favorites.value.includes(`${from}-${to}`)
  }

  return {
    baseCurrency,
    targetCurrency,
    rates,
    history,
    favorites,
    currencyList,
    fetchRates,
    addHistory,
    toggleFavorite,
    isFavorite
  }
})
