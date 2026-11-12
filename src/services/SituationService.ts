import { Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Situation } from '../entities/Situation';
import { PaginatedResult, PaginationService } from './PaginationService';

const pagination = new PaginationService();

export class SituationService {
  private repository = AppDataSource.getRepository(Situation);

  async create(data: Partial<Situation>): Promise<Situation> {
    const situation = this.repository.create(data);
    return await this.repository.save(situation);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<Situation>> {
    return pagination.paginate(this.repository, page, limit);
  }

  async findById(id: number): Promise<Situation | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByName(nameSituation: string, ignoreId?: number): Promise<Situation | null> {
    if (ignoreId !== undefined) {
      return await this.repository.findOne({
        where: {
          nameSituation,
          id: Not(ignoreId),
        },
      });
    }
    return await this.repository.findOne({
      where: { nameSituation },
    });
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
