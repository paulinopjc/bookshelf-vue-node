import 'dotenv/config'
import { pool } from './connection'

const schema = `
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
`

async function migrate() {
  await pool.query(schema)
  console.log('Migration complete.')
  await pool.end()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
