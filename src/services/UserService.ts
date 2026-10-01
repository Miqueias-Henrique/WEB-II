import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export class UserService {
  private repository = AppDataSource.getRepository(User);

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: User[], total: number, page: number, limit: number }> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: { situation: true }
    });

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({ where: { id }, relations: { situation: true } });
  }

  async update(id: number, data: Partial<User>): Promise<boolean> {
    const result = await this.repository.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
