import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import booksRouter from './routes/books'
import { HttpError } from './middleware/httpError'

export function createApp() {
  const app = express()

  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  app.use(cors({ origin: allowedOrigins }))
  app.use(morgan('dev'))
  app.use(express.json())

  app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Bookshelf API is running' })
  })

  app.use('/api/books', booksRouter)

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' })
  })

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      const body: Record<string, unknown> = { error: err.message }
      if (err.details) body.details = err.details
      res.status(err.status).json(body)
      return
    }
    console.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}