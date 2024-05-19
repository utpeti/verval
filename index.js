import express from 'express';
import { join } from 'path';
import morgan from 'morgan';
import { connectToDatabase } from './database/connection.js';
import errorLogger from './validations/error.js';
import classRouter from './routes/classes.js';
import assignmentRouter from './routes/assignments.js';

const app = express();
connectToDatabase();
app.use(morgan('common'));

app.set('view engine', 'ejs');
app.set('views', join(process.cwd(), 'views'));

app.use('/', classRouter);
app.use('/', assignmentRouter);
app.use(express.static(join(process.cwd(), 'public')));

app.use(errorLogger);

app.listen(8000, () => {
  console.log('Server listening...');
});
