import './bootstrap';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';
import routes from './routes';
import './database';
import sentryConfig from './config/sentry';
import io from 'socket.io';
import http from 'http';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
    // todos usuarios connectados
    this.connectedUsers = {};
  }

  socket() {
    this.io = io(this.server);
    this.io.on('connection', socket => {
      const { user_id } = socket.handshake.query;
      this.connectedUsers[user_id] = socket.id;
      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
      });
    });
  }

  middlewares() {
    this.app.use(Sentry.Handlers.requestHandler());
    // this.app.use(cors({origin:'link da aplicação}));
    this.app.use(cors({ origin: false }));
    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;
      next();
    });
    this.app.use(helmet());
    this.app.use(express.json());
    // limita as requisições do usuario
    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.NODE_ENV !== 'test'
    ) {
      this.app.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient({
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
            }),
          }),
          // mil milissegundos vezes 60 da um minuto vezes 15 15 minutos
          windowMs: 1000 * 60 * 15,
          // 100 requisições
          max: 100,
        })
      );
    }
  }

  routes() {
    this.app.use(routes);
    this.app.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
