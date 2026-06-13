<template>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/" class="text-xl font-semibold text-gray-900">
        📚 Bookshelf
      </router-link>

      <!-- Desktop nav -->
      <div class="hidden sm:flex items-center gap-3">
        <router-link
          to="/books"
          class="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-100 text-gray-900': route.path === '/books' }"
        >
          Books
        </router-link>
        <router-link
          to="/books/new"
          class="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Book
        </router-link>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="sm:hidden p-2 text-gray-600 hover:text-gray-900"
        @click="menuOpen = !menuOpen"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="sm:hidden border-t border-gray-200 px-4 py-3 space-y-2">
      <router-link
        to="/books"
        class="block text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
        @click="menuOpen = false"
      >
        Books
      </router-link>
      <router-link
        to="/books/new"
        class="block text-sm text-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        @click="menuOpen = false"
      >
        Add Book
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)

watch(() => route.path, () => {
  menuOpen.value = false
})
</script>
