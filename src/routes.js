import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import { multerUploads } from './app/middlewares/multer';
import FileController from './app/controllers/FileController';
import { cloudinaryConfig } from './config/cloudinaryConfig';
import AdminController from './app/controllers/AdminController';
import NotificationController from './app/controllers/NotificationController';
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';

const routes = new Router();
const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
const bruteForce = new Brute(bruteStore);

routes.get('/users', UserController.index);
routes.post('/users', validateUserStore, UserController.store);
routes.post(
  '/sessions',
  bruteForce.prevent,
  validateSessionStore,
  SessionController.store
);
// middleware local
// routes.put('/users', authMiddleware, UserController.update);
// to que vai antes do middleware passa antes não passa por ele
// routes.use(authMiddleware);
routes.put('/users', authMiddleware, validateUserUpdate, UserController.update);
routes.get('/admins', AdminController.index);
// listando as rotas de notificações
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
routes.use('*', cloudinaryConfig);
routes.post('/uploads', multerUploads, FileController.store);
export default routes;
