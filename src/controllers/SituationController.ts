import { Request, Response } from 'express';
import { sendError } from './sendError';
import { SituationService } from '../services/SituationService';

const situationService = new SituationService();

export class SituationController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await situationService.create(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao criar situation');
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await situationService.findAll(page, limit);
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar situations');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const result = await situationService.findById(id);
      if (!result) { res.status(404).json({ error: 'Situation não encontrada' }); return; }
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar situation');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const updated = await situationService.update(id, req.body);
      if (!updated) { res.status(404).json({ error: 'Situation não encontrada para atualizar' }); return; }
      res.json({ message: 'Situation atualizada com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao atualizar situation');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await situationService.delete(id);
      if (!deleted) { res.status(404).json({ error: 'Situation não encontrada para deletar' }); return; }
      res.json({ message: 'Situation deletada com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao deletar situation');
    }
  }
}
