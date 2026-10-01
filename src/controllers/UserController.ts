import { Request, Response } from 'express';
import { sendError } from './sendError';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      sendError(res, error, 'Erro ao criar usuário');
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.findAll(page, limit);
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar usuários');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const user = await userService.findById(id);

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json(user);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar usuário');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const updated = await userService.update(id, req.body);

      if (!updated) {
        res.status(404).json({ error: 'Usuário não encontrado para atualizar' });
        return;
      }

      res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao atualizar usuário');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await userService.delete(id);

      if (!deleted) {
        res.status(404).json({ error: 'Usuário não encontrado para deletar' });
        return;
      }

      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao deletar usuário');
    }
  }
}
