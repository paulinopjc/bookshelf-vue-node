import { describe, it, expect } from '@jest/globals'
import request from 'supertest'
import { createApp } from '../src/app'
import { db } from '../src/db/connection'

const app = createApp()

function seed(rows: Array<{ title: string; author: string; status?: string; rating?: number; review?: string }>) {
  const stmt = db.prepare(
    'INSERT INTO books (title, author, status, rating, review) VALUES (?, ?, ?, ?, ?)'
  )
  for (const row of rows) {
    stmt.run(row.title, row.author, row.status ?? 'unread', row.rating ?? null, row.review ?? null)
  }
}

describe('GET /api/books', () => {
  it('returns an empty list when no books exist', async () => {
    const res = await request(app).get('/api/books')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ data: [], count: 0 })
  })

  it('returns all books', async () => {
    seed([
      { title: 'Book A', author: 'Author A' },
      { title: 'Book B', author: 'Author B' },
    ])
    const res = await request(app).get('/api/books')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.count).toBe(2)
  })

  it('filters by status', async () => {
    seed([
      { title: 'Reading book', author: 'A', status: 'reading' },
      { title: 'Unread book', author: 'B', status: 'unread' },
    ])
    const res = await request(app).get('/api/books?status=reading')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].title).toBe('Reading book')
  })

  it('searches by title and author', async () => {
    seed([
      { title: 'Pragmatic Programmer', author: 'Andy Hunt' },
      { title: 'Clean Code', author: 'Robert Martin' },
    ])
    const res = await request(app).get('/api/books?q=clean')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].title).toBe('Clean Code')
  })
})

describe('POST /api/books', () => {
  it('creates a book with default status', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: 'New Book', author: 'New Author' })
    expect(res.status).toBe(201)
    expect(res.body.data.id).toBeDefined()
    expect(res.body.data.title).toBe('New Book')
    expect(res.body.data.status).toBe('unread')
  })

  it('rejects missing title', async () => {
    const res = await request(app).post('/api/books').send({ author: 'Just an author' })
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('Validation failed')
    expect(res.body.details.title).toBeDefined()
  })

  it('rejects invalid status', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: 'X', author: 'Y', status: 'banned' })
    expect(res.status).toBe(422)
    expect(res.body.details.status).toBeDefined()
  })
})

describe('GET /api/books/:id', () => {
  it('returns a single book', async () => {
    seed([{ title: 'Solo book', author: 'Solo author' }])
    const list = await request(app).get('/api/books')
    const id = list.body.data[0].id

    const res = await request(app).get(`/api/books/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe('Solo book')
  })

  it('returns 404 for missing book', async () => {
    const res = await request(app).get('/api/books/999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Book not found')
  })

  it('returns 400 for invalid id', async () => {
    const res = await request(app).get('/api/books/abc')
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/books/:id', () => {
  it('updates fields', async () => {
    seed([{ title: 'Old title', author: 'Old author' }])
    const list = await request(app).get('/api/books')
    const id = list.body.data[0].id

    const res = await request(app)
      .patch(`/api/books/${id}`)
      .send({ title: 'New title', status: 'reading' })

    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe('New title')
    expect(res.body.data.status).toBe('reading')
    expect(res.body.data.author).toBe('Old author')
  })

  it('rejects rating without finished status', async () => {
    seed([{ title: 'X', author: 'Y' }])
    const list = await request(app).get('/api/books')
    const id = list.body.data[0].id

    const res = await request(app)
      .patch(`/api/books/${id}`)
      .send({ status: 'reading', rating: 4 })

    expect(res.status).toBe(422)
  })

  it('returns 404 for missing book', async () => {
    const res = await request(app).patch('/api/books/999').send({ title: 'X' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/books/:id', () => {
  it('deletes a book', async () => {
    seed([{ title: 'Doomed', author: 'X' }])
    const list = await request(app).get('/api/books')
    const id = list.body.data[0].id

    const res = await request(app).delete(`/api/books/${id}`)
    expect(res.status).toBe(204)

    const after = await request(app).get(`/api/books/${id}`)
    expect(after.status).toBe(404)
  })

  it('returns 404 for missing book', async () => {
    const res = await request(app).delete('/api/books/999')
    expect(res.status).toBe(404)
  })
})

describe('GET /api/books/stats', () => {
  it('returns zeros for empty DB', async () => {
    const res = await request(app).get('/api/books/stats')
    expect(res.status).toBe(200)
    expect(res.body.data.total).toBe(0)
    expect(res.body.data.by_status.unread).toBe(0)
    expect(res.body.data.average_rating).toBeNull()
  })

  it('aggregates correctly', async () => {
    seed([
      { title: 'A', author: 'a', status: 'finished', rating: 4 },
      { title: 'B', author: 'b', status: 'finished', rating: 5 },
      { title: 'C', author: 'c', status: 'reading' },
    ])
    const res = await request(app).get('/api/books/stats')
    expect(res.body.data.total).toBe(3)
    expect(res.body.data.by_status.finished).toBe(2)
    expect(res.body.data.by_status.reading).toBe(1)
    expect(res.body.data.average_rating).toBe(4.5)
  })
})