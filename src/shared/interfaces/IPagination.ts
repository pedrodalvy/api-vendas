import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';

export interface IPagination<T> extends PaginationAwareObject {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page?: number | null;
  next_page?: number | null;
  last_page: number | null;
  data: T;
}
