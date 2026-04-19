import { beforeAll, afterEach, afterAll } from '@jest/globals'
import { pool } from '../src/db/connection'

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS books (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      author      TEXT NOT NULL,
      status      TEXT NOT NULL CHECK (status IN ('unread', 'reading', 'finished')),
      rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
      review      TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
  `)
})

afterEach(async () => {
  await pool.query('DELETE FROM books')
})

afterAll(async () => {
  await pool.end()
})
