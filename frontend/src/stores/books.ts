import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookApi } from '@/api/bookApi'
import type { Book, BookFilters, BookStats, CreateBookInput, UpdateBookInput } from '@/types/book'

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const stats = ref<BookStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<BookFilters>({})

  async function fetchBooks() {
    loading.value = true
    error.value = null
    try {
      const res = await bookApi.list(filters.value)
      books.value = res.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load books'
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      stats.value = await bookApi.stats()
    } catch {
      stats.value = null
    }
  }

  async function addBook(input: CreateBookInput): Promise<Book> {
    const created = await bookApi.create(input)
    books.value = [created, ...books.value]
    await fetchStats()
    return created
  }

  async function updateBook(id: number, input: UpdateBookInput): Promise<Book> {
    const updated = await bookApi.update(id, input)
    const idx = books.value.findIndex((b) => b.id === id)
    if (idx !== -1) {
      books.value[idx] = updated
    }
    await fetchStats()
    return updated
  }

  async function removeBook(id: number): Promise<void> {
    await bookApi.destroy(id)
    books.value = books.value.filter((b) => b.id !== id)
    await fetchStats()
  }

  function setFilters(next: BookFilters) {
    filters.value = next
  }

  const grouped = computed(() => {
    return {
      reading: books.value.filter((b) => b.status === 'reading'),
      unread: books.value.filter((b) => b.status === 'unread'),
      finished: books.value.filter((b) => b.status === 'finished'),
    }
  })

  return {
    books,
    stats,
    loading,
    error,
    filters,
    grouped,
    fetchBooks,
    fetchStats,
    addBook,
    updateBook,
    removeBook,
    setFilters,
  }
})