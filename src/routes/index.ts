import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { SituationController } from '../controllers/SituationController';
import { ProductCategoryController } from '../controllers/ProductCategoryController';
import { ProductSituationController } from '../controllers/ProductSituationController';
import { ProductController } from '../controllers/ProductController';
import { validateBody, validateId, validatePagination } from './validation';

const routes = Router();

const userController = new UserController();
const situationController = new SituationController();
const productCategoryController = new ProductCategoryController();
const productSituationController = new ProductSituationController();
const productController = new ProductController();

routes.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API rodando perfeitamente!' });
});

// Users
routes.post('/users', validateBody('users', true), userController.create);
routes.get('/users', validatePagination, userController.getAll);
routes.get('/users/:id', validateId, userController.getById);
routes.put('/users/:id', validateId, validateBody('users', false), userController.update);
routes.delete('/users/:id', validateId, userController.delete);

// Situations
routes.post('/situations', validateBody('situations', true), situationController.create);
routes.get('/situations', validatePagination, situationController.getAll);
routes.get('/situations/:id', validateId, situationController.getById);
routes.put('/situations/:id', validateId, validateBody('situations', false), situationController.update);
routes.delete('/situations/:id', validateId, situationController.delete);

// Product Categories
routes.post('/product-categories', validateBody('product-categories', true), productCategoryController.create);
routes.get('/product-categories', validatePagination, productCategoryController.getAll);
routes.get('/product-categories/:id', validateId, productCategoryController.getById);
routes.put('/product-categories/:id', validateId, validateBody('product-categories', false), productCategoryController.update);
routes.delete('/product-categories/:id', validateId, productCategoryController.delete);

// Product Situations
routes.post('/product-situations', validateBody('product-situations', true), productSituationController.create);
routes.get('/product-situations', validatePagination, productSituationController.getAll);
routes.get('/product-situations/:id', validateId, productSituationController.getById);
routes.put('/product-situations/:id', validateId, validateBody('product-situations', false), productSituationController.update);
routes.delete('/product-situations/:id', validateId, productSituationController.delete);

// Products
routes.post('/products', validateBody('products', true), productController.create);
routes.get('/products', validatePagination, productController.getAll);
routes.get('/products/:id', validateId, productController.getById);
routes.put('/products/:id', validateId, validateBody('products', false), productController.update);
routes.delete('/products/:id', validateId, productController.delete);

export default routes;
