import { AppDataSource } from '../data-source';
import { ProductCategory } from '../entities/ProductCategory';
import { PaginatedResult, PaginationService } from './PaginationService';

const pagination = new PaginationService();

export class ProductCategoryService {
  private repository = AppDataSource.getRepository(ProductCategory);

  async create(data: Partial<ProductCategory>): Promise<ProductCategory> {
    const category = this.repository.create(data);
    return await this.repository.save(category);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<ProductCategory>> {
    return pagination.paginate(this.repository, page, limit);
  }

  async findById(id: number): Promise<ProductCategory | null> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, data: Partial<ProductCategory>): Promise<boolean> {
    const result = await this.repository.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
