import { AppDataSource } from '../data-source';
import { ProductSituation } from '../entities/ProductSituation';

export class ProductSituationService {
  private repository = AppDataSource.getRepository(ProductSituation);

  async create(data: Partial<ProductSituation>): Promise<ProductSituation> {
    const situation = this.repository.create(data);
    return await this.repository.save(situation);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: ProductSituation[], total: number, page: number, limit: number }> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<ProductSituation | null> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, data: Partial<ProductSituation>): Promise<boolean> {
    const result = await this.repository.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
