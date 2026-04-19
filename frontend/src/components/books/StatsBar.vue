<template>
  <div v-if="stats" class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <p class="text-xs text-gray-500 uppercase tracking-wider">Total</p>
      <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.total }}</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <p class="text-xs text-gray-500 uppercase tracking-wider">Reading</p>
      <p class="text-2xl font-semibold text-amber-700 mt-1">{{ stats.by_status.reading }}</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <p class="text-xs text-gray-500 uppercase tracking-wider">Finished {{ year }}</p>
      <p class="text-2xl font-semibold text-green-700 mt-1">{{ stats.finished_this_year }}</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <p class="text-xs text-gray-500 uppercase tracking-wider">Avg rating</p>
      <p class="text-2xl font-semibold text-gray-900 mt-1">
        {{ stats.average_rating !== null ? stats.average_rating.toFixed(1) : '—' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookStats } from '@/types/book'

defineProps<{ stats: BookStats | null }>()

const year = new Date().getFullYear()
</script>