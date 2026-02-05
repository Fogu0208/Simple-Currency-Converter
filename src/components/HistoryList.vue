<template>
  <div class="mt-8 w-full">
    <h3 class="text-lg font-bold text-gray-300 mb-4 flex items-center">
      <!-- 简单的时钟图标 -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-mint-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      转换历史 (最近5条)
    </h3>
    <div v-if="history.length === 0" class="text-gray-500 text-center py-4 text-sm bg-gray-800/50 rounded-lg">
      暂无历史记录
    </div>
    <ul v-else class="space-y-3">
      <li 
        v-for="item in history" 
        :key="item.id"
        class="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-750 transition border border-gray-700/50"
      >
        <div class="flex flex-col">
          <div class="text-base font-medium">
            <span class="text-mint-400">{{ formatCurrency(item.amount, item.from) }}</span>
            <span class="mx-2 text-gray-500 text-sm">➔</span>
            <span class="text-white">{{ formatCurrency(item.result, item.to) }}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ item.date }} · 汇率: {{ item.rate.toFixed(4) }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useCurrencyStore } from '../store/currency'
import { storeToRefs } from 'pinia'
import { formatCurrency } from '../utils/format'

const store = useCurrencyStore()
const { history } = storeToRefs(store)
</script>
