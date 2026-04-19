import Database from 'better-sqlite3'
import path from 'path'

const dbPath = process.env.DATABASE_FILE || path.join(__dirname, '../../data/bookshelf.db')

export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')