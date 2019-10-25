import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import UserController from './app/controllers/UserController';
import PlanoController from './app/controllers/PlanoController';
import MatriculaController from './app/controllers/MatriculaController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import HelpOrderUserController from './app/controllers/HelpOrderUserController';

import isAuthenticated from './middleware/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/students/:id/help-orders', HelpOrderUserController.store);

routes.use(isAuthenticated);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/planos', PlanoController.store);
routes.get('/planos', PlanoController.index);
routes.put('/planos/:id', PlanoController.update);
routes.delete('/planos/:id', PlanoController.destroy);

routes.get('/matriculas', MatriculaController.index);
routes.post('/matriculas', MatriculaController.store);
routes.put('/matriculas/:id', MatriculaController.update);
routes.delete('/matriculas/:id', MatriculaController.destroy);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.destroy);

routes.get('/help-orders', HelpOrderController.index);

routes.get('/students/:id/help-orders', HelpOrderUserController.index);
routes.post('/help-orders/:id/answer', HelpOrderController.store);

export default routes;
