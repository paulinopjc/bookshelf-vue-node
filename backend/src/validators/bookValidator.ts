import { z } from 'zod'
import { BOOK_STATUSES } from '../types/book'

const status = z.enum(BOOK_STATUSES)

export const createBookSchema = z.object({
  title: z.string({ error: 'Title is required' }).min(1, 'Title is required').max(255),
  author: z.string({ error: 'Author is required' }).min(1, 'Author is required').max(255),
  status: status.optional(),
})

export const updateBookSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    author: z.string().min(1).max(255).optional(),
    status: status.optional(),
    rating: z.number().int().min(1).max(5).nullable().optional(),
    review: z.string().max(5000).nullable().optional(),
  })
  .refine(
    (data) => {
      const ratingOrReview = data.rating !== undefined || data.review !== undefined
      const targetStatus = data.status
      if (ratingOrReview && targetStatus && targetStatus !== 'finished') {
        return false
      }
      return true
    },
    { message: 'Rating and review can only be set when status is "finished"' }
  )

export const listFiltersSchema = z.object({
  status: status.optional(),
  q: z.string().min(1).max(100).optional(),
})

export type CreateBookSchema = z.infer<typeof createBookSchema>
export type UpdateBookSchema = z.infer<typeof updateBookSchema>
export type ListFiltersSchema = z.infer<typeof listFiltersSchema>