import { Request, Response } from 'express';
import { sendError } from './sendError';
import { ProductSituationService } from '../services/ProductSituationService';

const productSituationService = new ProductSituationService();

export class ProductSituationController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await productSituationService.create(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao criar product situation');
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await productSituationService.findAll(page, limit);
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar product situations');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const result = await productSituationService.findById(id);
      if (!result) { res.status(404).json({ error: 'Product Situation não encontrada' }); return; }
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar product situation');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const updated = await productSituationService.update(id, req.body);
      if (!updated) { res.status(404).json({ error: 'Product Situation não encontrada para atualizar' }); return; }
      res.json({ message: 'Product Situation atualizada com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao atualizar product situation');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await productSituationService.delete(id);
      if (!deleted) { res.status(404).json({ error: 'Product Situation não encontrada para deletar' }); return; }
      res.json({ message: 'Product Situation deletada com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao deletar product situation');
    }
  }
}
