import { db } from '../db/connection'
import {
    BOOK_STATUSES,
    type Book,
    type BookFilters,
    type BookStats,
    type BookStatus,
} from '../types/book'
import type { CreateBookSchema, UpdateBookSchema } from '../validators/bookValidator'

export const bookService = {
    list(filters: BookFilters = {}): Book[] {
        const where: string[] = []
        const params: unknown[] = []

        if (filters.status) {
            where.push('status = ?')
            params.push(filters.status)
        }

        if (filters.q) {
            where.push('(title LIKE ? OR author LIKE ?)')
            const like = `%${filters.q}%`
            params.push(like, like)
        }

        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
        const sql = `SELECT * FROM books ${whereClause} ORDER BY updated_at DESC`

        return db.prepare(sql).all(...params) as Book[]
    },

    find(id: number): Book | undefined {
        return db.prepare('SELECT * FROM books WHERE id = ?').get(id) as Book | undefined
    },

    create(input: CreateBookSchema): Book {
        const status: BookStatus = input.status ?? 'unread'
        const result = db.prepare('INSERT INTO books (title, author, status) VALUES (?, ?, ?)').run(input.title, input.author, status)

        return this.find(Number(result.lastInsertRowid))!
    },

    update(id: number, input: UpdateBookSchema): Book | undefined {
        const existing = this.find(id)
        if( !existing ) return undefined

        const fields: string[] = []
        const params: unknown[] = []

        for ( const key of ['title', 'author', 'status', 'rating', 'review'] as const ) {
            if( input[key] !== undefined ) {
                fields.push(`${key} = ?`)
                params.push(input[key])
            }
        }

        if (fields.length === 0) return existing

        fields.push("updated_at = datetime('now')")
        params.push(id)

        db.prepare(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`).run(...params)

        return this.find(id)
    },

    delete(id: number): boolean {
        const result = db.prepare('DELETE FROM books WHERE id = ?').run(id)
        return result.changes > 0
    },

    stats(): BookStats {
        const total = (db.prepare('SELECT COUNT(*) as c FROM books').get() as { c: number }).c

        const byStatusRows = db.prepare('SELECT status, COUNT(*) as c FROM books GROUP BY status').all() as { status: BookStatus, c: number }[]

        const by_status = Object.fromEntries(
            BOOK_STATUSES.map((s) => [s, 0])
        ) as Record<BookStatus, number>

        for (const row of byStatusRows) {
            by_status[row.status] = row.c
        }

        const avgRow = db
        .prepare("SELECT AVG(rating) as avg FROM books WHERE rating IS NOT NULL")
        .get() as { avg: number | null }

        const finishedThisYearRow = db
        .prepare(`
            SELECT COUNT(*) as c FROM books
            WHERE status = 'finished'
            AND strftime('%Y', updated_at) = strftime('%Y', 'now')
        `)
        .get() as { c: number }

        return {
            total,
            by_status,
            average_rating: avgRow.avg !== null ? Math.round(avgRow.avg * 10) / 10 : null,
            finished_this_year: finishedThisYearRow.c,
        }
    }
}