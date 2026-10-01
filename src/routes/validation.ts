import { Request, Response, NextFunction } from 'express';

type Field = 'name' | 'email' | 'nameSituation' | 'situationId' | 'productCategoryId' | 'productSituationId';

const schemas: Record<string, Field[]> = {
  users: ['name', 'email', 'situationId'],
  situations: ['nameSituation'],
  'product-categories': ['name'],
  'product-situations': ['name'],
  products: ['name', 'productCategoryId', 'productSituationId'],
};

function isPositiveInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

export function validateBody(resource: keyof typeof schemas, create: boolean) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body: unknown = req.body;
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'Envie um objeto JSON.' });
      return;
    }
    const data = body as Record<string, unknown>;
    const fields = schemas[resource];
    if (Object.keys(data).length === 0 || Object.keys(data).some(key => !fields.includes(key as Field))) {
      res.status(400).json({ error: 'Campos inválidos ou corpo vazio.' });
      return;
    }
    if (create && fields.some(field => !(field in data))) {
      res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
      return;
    }
    for (const [field, value] of Object.entries(data)) {
      if (field.endsWith('Id')) {
        if (!isPositiveInteger(value)) {
          res.status(400).json({ error: `${field} deve ser um inteiro positivo.` });
          return;
        }
      } else if (typeof value !== 'string' || value.trim().length === 0 || value.length > 255) {
        res.status(400).json({ error: `${field} deve ser um texto de 1 a 255 caracteres.` });
        return;
      }
    }
    if ('email' in data && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email as string)) {
      res.status(400).json({ error: 'E-mail inválido.' });
      return;
    }
    next();
  };
}

export function validateId(req: Request, res: Response, next: NextFunction): void {
  if (!/^[1-9]\d*$/.test(String(req.params.id)) || !Number.isSafeInteger(Number(req.params.id))) {
    res.status(400).json({ error: 'ID deve ser um inteiro positivo.' });
    return;
  }
  next();
}

export function validatePagination(req: Request, res: Response, next: NextFunction): void {
  for (const key of ['page', 'limit'] as const) {
    const value = req.query[key];
    if (value === undefined) continue;
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
      res.status(400).json({ error: `${key} deve ser um inteiro positivo.` });
      return;
    }
  }
  if (req.query.limit !== undefined && Number(req.query.limit) > 100) {
    res.status(400).json({ error: 'limit deve ser no máximo 100.' });
    return;
  }
  next();
}
