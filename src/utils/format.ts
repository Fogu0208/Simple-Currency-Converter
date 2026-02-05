/**
 * 格式化货币金额
 * @param amount 金额
 * @param currency 货币代码 (如 USD, CNY)
 * @returns 格式化后的字符串
 */
export const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  } catch (e) {
    // 如果货币代码不支持，回退到普通显示
    return `${amount.toFixed(2)} ${currency}`
  }
}

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 本地化日期字符串
 */
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}
