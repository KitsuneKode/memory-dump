import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/users.routes';
import brainRoutes from './routes/brain.routes';
import contentRoutes from './routes/content.routes';
import { NODE_ENV } from './config';
const app = express();

app.use(express.json());

const routes = [userRoutes, contentRoutes, brainRoutes];

routes.forEach((route) => {
  app.use('/api/v1/', route);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV! === 'dev') console.log(err);

  console.error(err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Page Not Found' });
});

export default app;
