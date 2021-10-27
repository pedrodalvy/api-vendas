import { IPagination } from '@shared/interfaces/IPagination';

export function makePaginatedResponseMock(
  responseData: any[],
): IPagination<any> {
  return {
    from: 99,
    to: 99,
    per_page: 99,
    total: 99,
    current_page: 99,
    prev_page: null,
    next_page: null,
    last_page: 99,
    data: responseData,
  };
}
