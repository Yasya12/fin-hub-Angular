export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: boolean;
}

export class PaginatedResult<T> {
    items?: T;
    pagination?: Pagination;
}