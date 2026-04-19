import { apiClient } from './client'
import type { Book, BookFilters, BookStats, CreateBookInput, UpdateBookInput } from '@/types/book'

interface ListResponse {
  data: Book[]
  count: number
}

interface SingleResponse {
  data: Book
}

interface StatsResponse {
  data: BookStats
}

export const bookApi = {
  async list(filters: BookFilters = {}): Promise<ListResponse> {
    const res = await apiClient.get<ListResponse>('/books', { params: filters })
    return res.data
  },

  async find(id: number): Promise<Book> {
    const res = await apiClient.get<SingleResponse>(`/books/${id}`)
    return res.data.data
  },

  async create(input: CreateBookInput): Promise<Book> {
    const res = await apiClient.post<SingleResponse>('/books', input)
    return res.data.data
  },

  async update(id: number, input: UpdateBookInput): Promise<Book> {
    const res = await apiClient.patch<SingleResponse>(`/books/${id}`, input)
    return res.data.data
  },

  async destroy(id: number): Promise<void> {
    await apiClient.delete(`/books/${id}`)
  },

  async stats(): Promise<BookStats> {
    const res = await apiClient.get<StatsResponse>('/books/stats')
    return res.data.data
  },
}