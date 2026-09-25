import { AppDataSource } from '../data-source';
import { Situation } from '../entities/Situation';

export class SituationService {
  private repository = AppDataSource.getRepository(Situation);

  async create(data: Partial<Situation>): Promise<Situation> {
    const situation = this.repository.create(data);
    return await this.repository.save(situation);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Situation[], total: number, page: number, limit: number }> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Situation | null> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, data: Partial<Situation>): Promise<boolean> {
    const result = await this.repository.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
