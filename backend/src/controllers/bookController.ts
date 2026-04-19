import { Request, Response, NextFunction } from 'express'
import { bookService } from '../services/bookService'
import {
  createBookSchema,
  updateBookSchema,
  listFiltersSchema,
} from '../validators/bookValidator'
import { HttpError } from '../middleware/httpError'

function flattenZodError(error: import('zod').ZodError): Record<string, string> {
  const details: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_'
    details[path] = issue.message
  }
  return details
}

export const bookController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = listFiltersSchema.safeParse(req.query)
      if (!parsed.success) {
        throw new HttpError(422, 'Invalid query parameters', flattenZodError(parsed.error))
      }
      const books = await bookService.list(parsed.data)
      res.json({ data: books, count: books.length })
    } catch (e) {
      next(e)
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, 'Invalid book id')
      }
      const book = await bookService.find(id)
      if (!book) {
        throw new HttpError(404, 'Book not found')
      }
      res.json({ data: book })
    } catch (e) {
      next(e)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createBookSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new HttpError(422, 'Validation failed', flattenZodError(parsed.error))
      }
      const book = await bookService.create(parsed.data)
      res.status(201).json({ data: book })
    } catch (e) {
      next(e)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, 'Invalid book id')
      }
      const parsed = updateBookSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new HttpError(422, 'Validation failed', flattenZodError(parsed.error))
      }
      const updated = await bookService.update(id, parsed.data)
      if (!updated) {
        throw new HttpError(404, 'Book not found')
      }
      res.json({ data: updated })
    } catch (e) {
      next(e)
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, 'Invalid book id')
      }
      const deleted = await bookService.delete(id)
      if (!deleted) {
        throw new HttpError(404, 'Book not found')
      }
      res.status(204).send()
    } catch (e) {
      next(e)
    }
  },

  async stats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await bookService.stats()
      res.json({ data: stats })
    } catch (e) {
      next(e)
    }
  },
}
