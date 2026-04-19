<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Add a Book</h1>
    <BookForm
      submit-label="Add Book"
      :saving="saving"
      :error="error"
      :field-errors="fieldErrors"
      @submit="onSubmit"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import BookForm from '@/components/books/BookForm.vue'
import type { CreateBookInput, UpdateBookInput } from '@/types/book'

const router = useRouter()
const store = useBooksStore()

const saving = ref(false)
const error = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

async function onSubmit(payload: CreateBookInput | UpdateBookInput) {
  saving.value = true
  error.value = null
  fieldErrors.value = {}
  try {
    await store.addBook(payload as CreateBookInput)
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