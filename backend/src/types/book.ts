export const BOOK_STATUSES = ['unread', 'reading', 'finished'] as const
export type BookStatus = (typeof BOOK_STATUSES)[number]

export interface Book {
    id: number
    title: string
    author: string
    status: BookStatus
    rating?: number
    review?: string
    created_at: string
    updated_at: string
}

export interface BookFilters {
    status?: BookStatus
    q?: string
}

export interface BookStats {
    total: number
    by_status: Record<BookStatus, number>
    average_rating: number | null
    finished_this_year: number
}