import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBooksStore } from '@/stores/books'
import { bookApi } from '@/api/bookApi'
import type { Book, BookStats } from '@/types/book'

vi.mock('@/api/bookApi', () => ({
  bookApi: {
    list: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    stats: vi.fn(),
  },
}))

const sampleBook: Book = {
  id: 1,
  title: 'Sample',
  author: 'Author',
  status: 'unread',
  rating: null,
  review: null,
  created_at: '2026-04-14 00:00:00',
  updated_at: '2026-04-14 00:00:00',
}

const sampleStats: BookStats = {
  total: 1,
  by_status: { unread: 1, reading: 0, finished: 0 },
  average_rating: null,
  finished_this_year: 0,
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useBooksStore', () => {
  it('fetchBooks loads books and clears error', async () => {
    ;(bookApi.list as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [sampleBook], count: 1 })
    const store = useBooksStore()
    await store.fetchBooks()

    expect(store.books).toHaveLength(1)
    expect(store.books[0].id).toBe(1)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchBooks sets error on API failure', async () => {
    ;(bookApi.list as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network down'))
    const store = useBooksStore()
    await store.fetchBooks()

    expect(store.error).toBe('Network down')
    expect(store.books).toEqual([])
  })

  it('addBook prepends to the list and refetches stats', async () => {
    ;(bookApi.create as ReturnType<typeof vi.fn>).mockResolvedValue(sampleBook)
    ;(bookApi.stats as ReturnType<typeof vi.fn>).mockResolvedValue(sampleStats)

    const store = useBooksStore()
    await store.addBook({ title: 'Sample', author: 'Author' })

    expect(store.books).toHaveLength(1)
    expect(bookApi.stats).toHaveBeenCalledTimes(1)
  })

  it('removeBook filters out the deleted id', async () => {
    ;(bookApi.list as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [sampleBook, { ...sampleBook, id: 2 }],
      count: 2,
    })
    ;(bookApi.destroy as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
    ;(bookApi.stats as ReturnType<typeof vi.fn>).mockResolvedValue(sampleStats)

    const store = useBooksStore()
    await store.fetchBooks()
    await store.removeBook(1)

    expect(store.books).toHaveLength(1)
    expect(store.books[0].id).toBe(2)
  })

  it('grouped computed splits by status', async () => {
    const reading = { ...sampleBook, id: 2, status: 'reading' as const }
    const finished = { ...sampleBook, id: 3, status: 'finished' as const }

    ;(bookApi.list as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [sampleBook, reading, finished],
      count: 3,
    })

    const store = useBooksStore()
    await store.fetchBooks()

    expect(store.grouped.unread).toHaveLength(1)
    expect(store.grouped.reading).toHaveLength(1)
    expect(store.grouped.finished).toHaveLength(1)
  })
})