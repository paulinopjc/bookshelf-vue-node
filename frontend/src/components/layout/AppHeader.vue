<template>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <router-link to="/" class="text-xl font-semibold text-gray-900">
        📚 Bookshelf
      </router-link>
      <router-link
        to="/books/new"
        class="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Add Book
      </router-link>
    </div>
  </header>
</template>