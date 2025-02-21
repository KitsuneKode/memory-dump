import app from './app';
import { PORT } from './config';

app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error('Failed to start server:', err);
  } else {
    console.log(`Connected to PORT: ${PORT}`);
  }
});
