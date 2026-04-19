<template>
  <div>
    <StatsBar :stats="store.stats" />
    <StatusFilter @change="onFilterChange" />

    <LoadingSpinner v-if="store.loading" />

    <div v-else-if="store.error" class="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
      {{ store.error }}
    </div>

    <div v-else-if="store.books.length === 0">
      <EmptyState
        title="No books yet"
        subtitle="Add your first book to get started"
      >
        <router-link
          to="/books/new"
          class="inline-block mt-4 text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add a book
        </router-link>
      </EmptyState>
    </div>

    <div v-else class="space-y-6">
      <section v-if="store.grouped.reading.length > 0">
        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Reading ({{ store.grouped.reading.length }})
        </h2>
        <div class="space-y-2">
          <BookCard
            v-for="book in store.grouped.reading"
            :key="book.id"
            :book="book"
            @delete="askDelete"
          />
        </div>
      </section>

      <section v-if="store.grouped.unread.length > 0">
        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Unread ({{ store.grouped.unread.length }})
        </h2>
        <div class="space-y-2">
          <BookCard
            v-for="book in store.grouped.unread"
            :key="book.id"
            :book="book"
            @delete="askDelete"
          />
        </div>
      </section>

      <section v-if="store.grouped.finished.length > 0">
        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Finished ({{ store.grouped.finished.length }})
        </h2>
        <div class="space-y-2">
          <BookCard
            v-for="book in store.grouped.finished"
            :key="book.id"
            :book="book"
            @delete="askDelete"
          />
        </div>
      </section>
    </div>

    <ConfirmModal
      :open="confirmId !== null"
      title="Delete book?"
      message="This will permanently remove the book from your shelf."
      @confirm="confirmDelete"
      @cancel="confirmId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBooksStore } from '@/stores/books'
import StatsBar from '@/components/books/StatsBar.vue'
import StatusFilter from '@/components/books/StatusFilter.vue'
import BookCard from '@/components/books/BookCard.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import type { BookFilters } from '@/types/book'

const store = useBooksStore()
const confirmId = ref<number | null>(null)

onMounted(async () => {
  await Promise.all([store.fetchBooks(), store.fetchStats()])
})

function onFilterChange(filters: BookFilters) {
  store.setFilters(filters)
  store.fetchBooks()
}

function askDelete(id: number) {
  confirmId.value = id
}

async function confirmDelete() {
  if (confirmId.value === null) return
  await store.removeBook(confirmId.value)
  confirmId.value = null
}
</script>