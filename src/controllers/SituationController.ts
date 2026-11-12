import { Request, Response } from 'express';
import * as yup from 'yup';
import { sendError } from './sendError';
import { SituationService } from '../services/SituationService';

const situationService = new SituationService();

export class SituationController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      const schema = yup.object().shape({
        nameSituation: yup
          .string()
          .required('O campo nome é obrigatório!')
          .min(3, 'O campo nome deve ter no mínimo 3 caracteres!'),
      });

      await schema.validate(data, { abortEarly: false });

      const existingSituation = await situationService.findByName(data.nameSituation);
      if (existingSituation) {
        res.status(400).json({
          error: 'Já existe uma situação cadastrada com esse nome.',
        });
        return;
      }

      const result = await situationService.create({ nameSituation: data.nameSituation });
      res.status(201).json(result);
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        res.status(400).json({
          error: error.errors,
        });
        return;
      }
      sendError(res, error, 'Erro ao criar situation');
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await situationService.findAll(page, limit);
      res.json(result);
    } catch (error: unknown) {
      sendError(res, error, 'Erro ao buscar situations');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const result = await situationService.findById(id);
      if (!result) { res.status(404).json({ error: 'Situation não encontrada' }); return; }
      res.json(result);
    } catch (error: unknown) {
      sendError(res, error, 'Erro ao buscar situation');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const data = req.body;

      const schema = yup.object().shape({
        nameSituation: yup
          .string()
          .required('O campo nome é obrigatório!')
          .min(3, 'O campo nome deve ter no mínimo 3 caracteres!'),
      });

      await schema.validate(data, { abortEarly: false });

      const situation = await situationService.findById(id);
      if (!situation) {
        res.status(404).json({ error: 'Situation não encontrada para atualizar' });
        return;
      }

      const existingSituation = await situationService.findByName(data.nameSituation, id);
      if (existingSituation) {
        res.status(400).json({
          error: 'Já existe uma situação cadastrada com esse nome.',
        });
        return;
      }

      const updated = await situationService.update(id, { nameSituation: data.nameSituation });
      if (!updated) { res.status(404).json({ error: 'Situation não encontrada para atualizar' }); return; }
      res.json({ message: 'Situation atualizada com sucesso' });
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        res.status(400).json({
          error: error.errors,
        });
        return;
      }
      sendError(res, error, 'Erro ao atualizar situation');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await situationService.delete(id);
      if (!deleted) { res.status(404).json({ error: 'Situation não encontrada para deletar' }); return; }
      res.json({ message: 'Situation deletada com sucesso' });
    } catch (error: unknown) {
      sendError(res, error, 'Erro ao deletar situation');
    }
  }
}
