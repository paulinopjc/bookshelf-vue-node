<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4">
    <div class="flex-1 min-w-0">
      <p class="font-medium text-gray-900 truncate">{{ book.title }}</p>
      <p class="text-sm text-gray-500 truncate">{{ book.author }}</p>
      <div class="flex items-center gap-2 mt-2">
        <StatusBadge :status="book.status" />
        <span v-if="book.rating" class="text-xs text-gray-500">★ {{ book.rating }}</span>
      </div>
      <p v-if="book.review" class="text-xs text-gray-600 mt-2 italic">
        "{{ book.review }}"
      </p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <router-link
        :to="`/books/${book.id}/edit`"
        class="text-xs text-indigo-600 hover:underline"
      >
        Edit
      </router-link>
      <button
        @click="emit('delete', book.id)"
        class="text-xs text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'
import type { Book } from '@/types/book'

defineProps<{ book: Book }>()
const emit = defineEmits<{ (e: 'delete', id: number): void }>()
</script>