import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import logger from './utils/logger.js';

const app = express();

/**
 * Morgan logging format string
 * @type {string}
 */
const morganFormat = ':method :url :status :response-time ms';

// Configure middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

/**
 * Morgan middleware configuration for HTTP request logging
 * Logs request details in a structured format
 */
app.use(
  morgan(morganFormat, {
    stream: {
      write: message => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  }),
);

// Import route handlers
import healthCheckRouter from './routes/health-check.route.js';
import userRouter from './routes/user.route.js';
import profileRouter from './routes/profile.route.js';
import projectRouter from './routes/project.route.js';
import githubRouter from './routes/github.route.js';
import postRouter from './routes/post.route.js';
import reactionRouter from './routes/like.route.js';
import commentRouter from './routes/comment.route.js';

// Register API routes
app.use('/api/v1/health-check', healthCheckRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/github', githubRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/reaction', reactionRouter);
app.use('/api/v1/comment', commentRouter);

// Error middleware
import { errorHandler } from './middleware/error.middleware.js';

app.use(errorHandler);

export { app };
