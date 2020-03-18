import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import { multerUploads } from './app/middlewares/multer';
import FileController from './app/controllers/FileController';
import { cloudinaryConfig } from './config/cloudinaryConfig';
import AdminController from './app/controllers/AdminController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
// middleware local
// routes.put('/users', authMiddleware, UserController.update);
// to que vai antes do middleware passa antes não passa por ele
// routes.use(authMiddleware);
routes.put('/users', authMiddleware, UserController.update);
routes.get('/admins', AdminController.index);
// listando as rotas de notificações
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
routes.use('*', cloudinaryConfig);
routes.post('/uploads', multerUploads, FileController.store);
export default routes;
