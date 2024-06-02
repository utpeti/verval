import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();
const threeDays = 3 * 24 * 60 * 60 * 1000;

export default session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: threeDays,
    sameSite: 'strict',
  },
});
