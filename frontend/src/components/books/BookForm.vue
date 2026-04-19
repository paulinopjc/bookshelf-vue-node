<template>
  <form @submit.prevent="onSubmit" class="bg-white border border-gray-200 rounded-lg p-6 space-y-4 max-w-xl">
    <div v-if="error" class="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-700">
      {{ error }}
    </div>

    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Title *</label>
      <input
        v-model="form.title"
        type="text"
        required
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />
      <p v-if="fieldErrors.title" class="text-xs text-red-600 mt-1">{{ fieldErrors.title }}</p>
    </div>

    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Author *</label>
      <input
        v-model="form.author"
        type="text"
        required
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />
      <p v-if="fieldErrors.author" class="text-xs text-red-600 mt-1">{{ fieldErrors.author }}</p>
    </div>

    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
      <select
        v-model="form.status"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      >
        <option v-for="s in BOOK_STATUSES" :key="s" :value="s">{{ s.charAt(0).toUpperCase() + s.slice(1) }}</option>
      </select>
    </div>

    <template v-if="form.status === 'finished'">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Rating</label>
        <select
          v-model.number="form.rating"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option :value="null">No rating</option>
          <option :value="1">★ 1</option>
          <option :value="2">★★ 2</option>
          <option :value="3">★★★ 3</option>
          <option :value="4">★★★★ 4</option>
          <option :value="5">★★★★★ 5</option>
        </select>
        <p v-if="fieldErrors.rating" class="text-xs text-red-600 mt-1">{{ fieldErrors.rating }}</p>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Review</label>
        <textarea
          v-model="form.review"
          rows="3"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
        <p v-if="fieldErrors.review" class="text-xs text-red-600 mt-1">{{ fieldErrors.review }}</p>
      </div>
    </template>

    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        :disabled="saving"
        class="px-5 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ saving ? 'Saving…' : submitLabel }}
      </button>
      <button
        type="button"
        @click="emit('cancel')"
        class="px-5 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { BOOK_STATUSES } from '@/types/book'
import type { Book, BookStatus, CreateBookInput, UpdateBookInput } from '@/types/book'

const props = defineProps<{
  initial?: Book
  submitLabel: string
  saving?: boolean
  error?: string | null
  fieldErrors?: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'submit', payload: CreateBookInput | UpdateBookInput): void
  (e: 'cancel'): void
}>()

const form = reactive({
  title: '',
  author: '',
  status: 'unread' as BookStatus,
  rating: null as number | null,
  review: '' as string,
})

const fieldErrors = ref<Record<string, string>>({})

watch(
  () => props.initial,
  (initial) => {
    if (initial) {
      form.title = initial.title
      form.author = initial.author
      form.status = initial.status
      form.rating = initial.rating
      form.review = initial.review ?? ''
    }
  },
  { immediate: true },
)

watch(
  () => props.fieldErrors,
  (next) => {
    fieldErrors.value = next ?? {}
  },
  { immediate: true },
)

watch(
  () => form.status,
  (s) => {
    if (s !== 'finished') {
      form.rating = null
      form.review = ''
    }
  },
)

function onSubmit() {
  const payload: CreateBookInput | UpdateBookInput = {
    title: form.title,
    author: form.author,
    status: form.status,
  }
  if (form.status === 'finished') {
    if (form.rating !== null) (payload as UpdateBookInput).rating = form.rating
    if (form.review.trim()) (payload as UpdateBookInput).review = form.review.trim()
  }
  emit('submit', payload)
}
</script>