<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Edit Book</h1>

    <LoadingSpinner v-if="loading" />

    <BookForm
      v-else-if="book"
      :initial="book"
      submit-label="Save Changes"
      :saving="saving"
      :error="error"
      :field-errors="fieldErrors"
      @submit="onSubmit"
      @cancel="onCancel"
    />

    <div v-else class="text-sm text-gray-500">Book not found.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { bookApi } from '@/api/bookApi'
import BookForm from '@/components/books/BookForm.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import type { Book, CreateBookInput, UpdateBookInput } from '@/types/book'

const route = useRoute()
const router = useRouter()
const store = useBooksStore()

const id = Number(route.params.id)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})
const book = ref<Book | null>(null)

onMounted(async () => {
  try {
    book.value = await bookApi.find(id)
  } catch {
    book.value = null
  } finally {
    loading.value = false
  }
})

async function onSubmit(payload: CreateBookInput | UpdateBookInput) {
  saving.value = true
  error.value = null
  fieldErrors.value = {}
  try {
    await store.updateBook(id, payload as UpdateBookInput)
    router.push('/books')
  } catch (e: unknown) {
    const err = e as { response?: { data?: { error?: string; details?: Record<string, string> } } }
    fieldErrors.value = err.response?.data?.details ?? {}
    error.value = err.response?.data?.error ?? 'Failed to save book.'
  } finally {
    saving.value = false
  }
}

function onCancel() {
  router.push('/books')
}
</script>