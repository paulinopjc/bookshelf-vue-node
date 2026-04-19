import { beforeAll, afterEach } from '@jest/globals'
import { db } from '../src/db/connection'

beforeAll(() => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      author      TEXT NOT NULL,
      status      TEXT NOT NULL CHECK (status IN ('unread', 'reading', 'finished')),
      rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
      review      TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
  `)
})

afterEach(() => {
  db.exec('DELETE FROM books')
})