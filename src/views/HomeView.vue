<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center py-12 px-4 font-sans">
    <div class="w-full max-w-md">
      <!-- 标题 -->
      <h1 class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-emerald-600 mb-8 tracking-wide">
        极简汇率转换
      </h1>

      <!-- 主卡片 -->
      <div class="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
        <!-- 金额输入 -->
        <div class="mb-6">
          <label class="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">金额</label>
          <el-input 
            v-model.number="amount" 
            type="number" 
            placeholder="请输入金额" 
            size="large"
            class="w-full custom-input"
          >
            <template #prefix>
              <span class="text-gray-400 font-bold">$</span>
            </template>
          </el-input>
        </div>

        <!-- 货币选择区域 -->
        <div class="grid grid-cols-[1fr_auto_1fr] gap-3 items-end mb-8">
          <!-- 源货币 -->
          <div>
             <label class="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">持有</label>
             <el-select 
                v-model="baseCurrency" 
                filterable 
                placeholder="币种" 
                size="large"
                @change="handleBaseChange"
                class="w-full"
            >
                <el-option 
                v-for="code in currencyList" 
                :key="code" 
                :label="code" 
                :value="code" 
                />
            </el-select>
          </div>

          <!-- 交换按钮 -->
          <button 
            @click="swapCurrencies"
            class="mb-[2px] p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-mint-500 transition shadow-md active:scale-95"
            title="交换货币"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <!-- 目标货币 -->
          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">兑换</label>
            <el-select 
                v-model="targetCurrency" 
                filterable 
                placeholder="币种" 
                size="large"
                class="w-full"
            >
                <el-option 
                v-for="code in currencyList" 
                :key="code" 
                :label="code" 
                :value="code" 
                />
            </el-select>
          </div>
        </div>

        <!-- 转换按钮 -->
        <button 
          @click="convert"
          :disabled="loading"
          class="w-full bg-mint-500 hover:bg-mint-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-mint-500/20 flex justify-center items-center text-lg active:scale-[0.98]"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? '获取最新汇率中...' : '开始转换' }}
        </button>

        <!-- 结果展示 -->
        <div v-if="result !== null" class="mt-8 text-center animate-fade-in bg-gray-750/30 p-4 rounded-xl border border-gray-700/30">
          <div class="text-gray-400 text-sm mb-2 font-mono">
            1 {{ baseCurrency }} ≈ {{ currentRate.toFixed(4) }} {{ targetCurrency }}
          </div>
          <div class="text-4xl font-bold text-white break-words tracking-tight">
            {{ formatCurrency(result, targetCurrency) }}
          </div>
          
          <!-- 收藏按钮 -->
          <div class="mt-4 pt-4 border-t border-gray-700/50">
             <button 
               @click="toggleFav"
               class="text-sm flex items-center justify-center mx-auto text-gray-400 hover:text-yellow-400 transition group"
               :class="{ 'text-yellow-400': isFav }"
             >
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 transition-transform group-hover:scale-110" :fill="isFav ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
               </svg>
               {{ isFav ? '已收藏' : '收藏此汇率对' }}
             </button>
          </div>
        </div>
      </div>

      <!-- 收藏列表 -->
      <div v-if="favorites.length > 0" class="mt-8">
        <h4 class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 ml-1">常用汇率</h4>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="fav in favorites" 
            :key="fav"
            @click="loadFav(fav)"
            class="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 cursor-pointer hover:border-mint-500 hover:text-mint-400 transition flex items-center"
          >
            {{ fav.replace('-', ' → ') }}
          </span>
        </div>
      </div>

      <!-- 历史记录组件 -->
      <HistoryList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCurrencyStore } from '../store/currency'
import { storeToRefs } from 'pinia'
import { formatCurrency, formatDate } from '../utils/format'
import HistoryList from '../components/HistoryList.vue'
import { ElMessage } from 'element-plus'

// Store
const store = useCurrencyStore()
const { baseCurrency, targetCurrency, rates, favorites, currencyList } = storeToRefs(store)

// State
const amount = ref<number>(100)
const loading = ref(false)
const result = ref<number | null>(null)

// Computed
const currentRate = computed(() => {
  if (!rates.value || !targetCurrency.value) return 0
  return rates.value[targetCurrency.value] || 0
})

const isFav = computed(() => {
  return store.isFavorite(baseCurrency.value, targetCurrency.value)
})

// Lifecycle
onMounted(async () => {
  // 初始化加载默认货币汇率
  loading.value = true
  try {
    await store.fetchRates(baseCurrency.value)
  } catch (e) {
      // 错误已在 API 层处理
  } finally {
    loading.value = false
  }
})

// Methods
const handleBaseChange = async () => {
  loading.value = true
  try {
    await store.fetchRates(baseCurrency.value)
    result.value = null // 重置结果
  } finally {
    loading.value = false
  }
}

const swapCurrencies = () => {
  const temp = baseCurrency.value
  baseCurrency.value = targetCurrency.value
  targetCurrency.value = temp
  handleBaseChange()
}

const convert = () => {
  if (!amount.value || amount.value <= 0) {
      ElMessage.warning('请输入有效的金额')
      return
  }
  
  if (currentRate.value === 0) {
      // 尝试重新获取
      handleBaseChange().then(() => {
          if (currentRate.value !== 0) convert()
      })
      return
  }

  const res = amount.value * currentRate.value
  result.value = res

  // 添加到历史记录
  store.addHistory({
    from: baseCurrency.value,
    to: targetCurrency.value,
    amount: amount.value,
    result: res,
    rate: currentRate.value,
    date: formatDate(new Date().toISOString())
  })
}

const toggleFav = () => {
  store.toggleFavorite(baseCurrency.value, targetCurrency.value)
}

const loadFav = (fav: string) => {
  const [from, to] = fav.split('-')
  if (from && to) {
    baseCurrency.value = from
    targetCurrency.value = to
    handleBaseChange()
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* 自定义 Input 样式覆盖 Element Plus 默认样式以匹配深色主题 */
:deep(.el-input__wrapper) {
    background-color: #1f2937 !important; /* bg-gray-800 */
    box-shadow: 0 0 0 1px #374151 inset !important; /* border-gray-700 */
}
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #22c55e inset !important; /* mint-500 */
}
:deep(.el-input__inner) {
    color: white !important;
}

:deep(.el-select__wrapper) {
    background-color: #1f2937 !important;
    box-shadow: 0 0 0 1px #374151 inset !important;
}
:deep(.el-select__wrapper.is-focused) {
    box-shadow: 0 0 0 1px #22c55e inset !important;
}
</style>
