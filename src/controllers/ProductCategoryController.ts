import { Request, Response } from 'express';
import { sendError } from './sendError';
import { ProductCategoryService } from '../services/ProductCategoryService';

const productCategoryService = new ProductCategoryService();

export class ProductCategoryController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await productCategoryService.create(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao criar product category');
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await productCategoryService.findAll(page, limit);
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar product categories');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const result = await productCategoryService.findById(id);
      if (!result) { res.status(404).json({ error: 'Product Category não encontrada' }); return; }
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar product category');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const updated = await productCategoryService.update(id, req.body);
      if (!updated) { res.status(404).json({ error: 'Product Category não encontrada para atualizar' }); return; }
      res.json({ message: 'Product Category atualizada com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao atualizar product category');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await productCategoryService.delete(id);
      if (!deleted) { res.status(404).json({ error: 'Product Category não encontrada para deletar' }); return; }
      res.json({ message: 'Product Category deletada com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao deletar product category');
    }
  }
}
