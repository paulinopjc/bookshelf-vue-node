<template>
  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', classes]">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BookStatus } from '@/types/book'

const props = defineProps<{ status: BookStatus }>()

const classes = computed(() => {
  switch (props.status) {
    case 'reading':
      return 'bg-amber-100 text-amber-700'
    case 'finished':
      return 'bg-green-100 text-green-700'
    case 'unread':
    default:
      return 'bg-gray-100 text-gray-600'
  }
})

const label = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})
</script>