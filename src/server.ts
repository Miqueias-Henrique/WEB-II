import 'reflect-metadata';
import 'dotenv/config';
import app from './app';
import { AppDataSource } from './data-source';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log(`Conectado ao banco de dados MySQL via TypeORM!`);
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('Erro ao conectar com o banco de dados:', error));
