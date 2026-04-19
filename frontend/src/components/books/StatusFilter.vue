<template>
  <div class="flex items-center gap-2 mb-4">
    <input
      v-model="search"
      type="text"
      placeholder="Search title or author…"
      class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
    />
    <select
      v-model="status"
      class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
    >
      <option value="">All statuses</option>
      <option v-for="s in BOOK_STATUSES" :key="s" :value="s">
        {{ s.charAt(0).toUpperCase() + s.slice(1) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import debounce from 'lodash.debounce'
import { BOOK_STATUSES } from '@/types/book'
import type { BookFilters, BookStatus } from '@/types/book'

const emit = defineEmits<{
  (e: 'change', filters: BookFilters): void
}>()

const search = ref('')
const status = ref<BookStatus | ''>('')

const emitFilters = debounce(() => {
  const filters: BookFilters = {}
  if (search.value.trim()) filters.q = search.value.trim()
  if (status.value) filters.status = status.value as BookStatus
  emit('change', filters)
}, 300)

watch([search, status], emitFilters)
</script>