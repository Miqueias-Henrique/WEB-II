import { Request, Response } from 'express';
import { sendError } from './sendError';
import { ProductService } from '../services/ProductService';

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await productService.create(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao criar product');
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await productService.findAll(page, limit);
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar products');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const result = await productService.findById(id);
      if (!result) { res.status(404).json({ error: 'Product não encontrado' }); return; }
      res.json(result);
    } catch (error: any) {
      sendError(res, error, 'Erro ao buscar product');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const updated = await productService.update(id, req.body);
      if (!updated) { res.status(404).json({ error: 'Product não encontrado para atualizar' }); return; }
      res.json({ message: 'Product atualizado com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao atualizar product');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await productService.delete(id);
      if (!deleted) { res.status(404).json({ error: 'Product não encontrado para deletar' }); return; }
      res.json({ message: 'Product deletado com sucesso' });
    } catch (error: any) {
      sendError(res, error, 'Erro ao deletar product');
    }
  }
}
