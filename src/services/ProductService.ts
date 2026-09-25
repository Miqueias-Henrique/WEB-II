import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';

export class ProductService {
  private repository = AppDataSource.getRepository(Product);

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.repository.create(data);
    return await this.repository.save(product);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Product[], total: number, page: number, limit: number }> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: { productCategory: true, productSituation: true }
    });

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Product | null> {
    return await this.repository.findOne({ where: { id }, relations: { productCategory: true, productSituation: true } });
  }

  async update(id: number, data: Partial<Product>): Promise<boolean> {
    const result = await this.repository.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
