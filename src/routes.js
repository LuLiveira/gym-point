import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import UserController from './app/controllers/UserController';
import isAuthenticated from './middleware/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(isAuthenticated);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.destroy);

export default routes;
