import { FindManyOptions, FindOptionsOrder, ObjectLiteral, Repository } from 'typeorm';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export class PageOutOfRangeError extends Error {
  constructor(lastPage: number) {
    super(`Página inexistente. Última página: ${lastPage}.`);
    this.name = 'PageOutOfRangeError';
  }
}

export class PaginationService {
  async paginate<T extends ObjectLiteral & { id: number }>(
    repository: Repository<T>,
    page: number = 1,
    limit: number = 10,
    options: Omit<FindManyOptions<T>, 'skip' | 'take' | 'order'> = {},
  ): Promise<PaginatedResult<T>> {
    const [data, total] = await repository.findAndCount({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' } as unknown as FindOptionsOrder<T>,
    });

    const lastPage = Math.ceil(total / limit);
    if (page > Math.max(lastPage, 1)) {
      throw new PageOutOfRangeError(lastPage);
    }

    return { data, total, page, limit, lastPage };
  }
}
