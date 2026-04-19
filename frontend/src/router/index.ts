import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/books' },
    { path: '/books', component: () => import('@/views/BookListView.vue') },
    { path: '/books/new', component: () => import('@/views/BookCreateView.vue') },
    { path: '/books/:id/edit', component: () => import('@/views/BookEditView.vue') },
  ],
})

export default router