import { AppDataSource } from '../data-source';
import { ProductCategory } from '../entities/ProductCategory';

export class ProductCategoryService {
  private repository = AppDataSource.getRepository(ProductCategory);

  async create(data: Partial<ProductCategory>): Promise<ProductCategory> {
    const category = this.repository.create(data);
    return await this.repository.save(category);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: ProductCategory[], total: number, page: number, limit: number }> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
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
