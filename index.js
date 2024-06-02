import express from 'express';
import { join } from 'path';
import morgan from 'morgan';
import sessionManager from './session/session.js';
import { connectToDatabase } from './database/connection.js';
import errorLogger from './errors/error.js';
import classRouter from './routes/classes.js';
import assignmentRouter from './routes/assignments.js';
import loginRouter from './routes/login.js';
import invitationRouter from './routes/invitation.js';
import usersRouter from './routes/users.js';
import authenticateMiddleware from './middleware/authentication.js';
import classInvitationRouter from './routes/classinvitations.js';

const app = express();
connectToDatabase();
app.use(morgan('common'));

app.use(sessionManager);
app.set('view engine', 'ejs');
app.set('views', join(process.cwd(), 'views'));

app.use(express.static(join(process.cwd(), 'public')));

app.use('/', invitationRouter);

app.use('/', loginRouter);
app.use(authenticateMiddleware);

app.use('/', classRouter);
app.use('/', assignmentRouter);
app.use('/', usersRouter);
app.use('/', classInvitationRouter);

app.use(errorLogger);

app.listen(8000, () => {
  console.log('Server listening...');
});
