import express from 'express';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();

app.use(express.json());

// Swagger Docs Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

export default app;
