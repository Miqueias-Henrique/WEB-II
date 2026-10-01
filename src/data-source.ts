import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/entities/*.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  subscribers: [],
});
