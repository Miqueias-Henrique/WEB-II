import { Response } from 'express';

export function sendError(res: Response, error: unknown, message: string): void {
  const code = (error as { driverError?: { code?: string }; code?: string })?.driverError?.code
    ?? (error as { code?: string })?.code;

  if (code === 'ER_DUP_ENTRY') {
    res.status(409).json({ error: 'Registro duplicado.' });
    return;
  }
  if (code === 'ER_NO_REFERENCED_ROW_2') {
    res.status(400).json({ error: 'Referência inexistente.' });
    return;
  }
  if (code === 'ER_ROW_IS_REFERENCED_2') {
    res.status(409).json({ error: 'Registro em uso por outro recurso.' });
    return;
  }

  console.error(message, error);
  res.status(500).json({ error: message });
}
