import { pool } from '../db/connection'
import {
    BOOK_STATUSES,
    type Book,
    type BookFilters,
    type BookStats,
    type BookStatus,
} from '../types/book'
import type { CreateBookSchema, UpdateBookSchema } from '../validators/bookValidator'

export const bookService = {
    async list(filters: BookFilters = {}): Promise<Book[]> {
        const where: string[] = []
        const params: unknown[] = []
        let paramIndex = 1

        if (filters.status) {
            where.push(`status = $${paramIndex++}`)
            params.push(filters.status)
        }

        if (filters.q) {
            where.push(`(title ILIKE $${paramIndex} OR author ILIKE $${paramIndex + 1})`)
            const like = `%${filters.q}%`
            params.push(like, like)
            paramIndex += 2
        }

        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
        const sql = `SELECT * FROM books ${whereClause} ORDER BY updated_at DESC`

        const { rows } = await pool.query(sql, params)
        return rows as Book[]
    },

    async find(id: number): Promise<Book | undefined> {
        const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id])
        return rows[0] as Book | undefined
    },

    async create(input: CreateBookSchema): Promise<Book> {
        const status: BookStatus = input.status ?? 'unread'
        const { rows } = await pool.query(
            'INSERT INTO books (title, author, status) VALUES ($1, $2, $3) RETURNING *',
            [input.title, input.author, status]
        )
        return rows[0] as Book
    },

    async update(id: number, input: UpdateBookSchema): Promise<Book | undefined> {
        const existing = await this.find(id)
        if (!existing) return undefined

        const fields: string[] = []
        const params: unknown[] = []
        let paramIndex = 1

        for (const key of ['title', 'author', 'status', 'rating', 'review'] as const) {
            if (input[key] !== undefined) {
                fields.push(`${key} = $${paramIndex++}`)
                params.push(input[key])
            }
        }

        if (fields.length === 0) return existing

        fields.push(`updated_at = NOW()`)
        params.push(id)

        await pool.query(
            `UPDATE books SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
            params
        )

        return this.find(id)
    },

    async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM books WHERE id = $1', [id])
        return (result.rowCount ?? 0) > 0
    },

    async stats(): Promise<BookStats> {
        const totalResult = await pool.query('SELECT COUNT(*) as c FROM books')
        const total = parseInt(totalResult.rows[0].c, 10)

        const byStatusResult = await pool.query(
            'SELECT status, COUNT(*) as c FROM books GROUP BY status'
        )

        const by_status = Object.fromEntries(
            BOOK_STATUSES.map((s) => [s, 0])
        ) as Record<BookStatus, number>

        for (const row of byStatusResult.rows) {
            by_status[row.status as BookStatus] = parseInt(row.c, 10)
        }

        const avgResult = await pool.query(
            'SELECT AVG(rating) as avg FROM books WHERE rating IS NOT NULL'
        )
        const avg = avgResult.rows[0].avg

        const finishedResult = await pool.query(`
            SELECT COUNT(*) as c FROM books
            WHERE status = 'finished'
            AND EXTRACT(YEAR FROM updated_at) = EXTRACT(YEAR FROM NOW())
        `)
        const finished_this_year = parseInt(finishedResult.rows[0].c, 10)

        return {
            total,
            by_status,
            average_rating: avg !== null ? Math.round(parseFloat(avg) * 10) / 10 : null,
            finished_this_year,
        }
    }
}
