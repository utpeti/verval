import express from 'express';
import bcrypt from 'bcrypt';
import { loginValidation } from '../validations/loginValidation.js';
import { signupValidation } from '../validations/signupValidation.js';
import * as dbUser from '../database/users.js';
import { authorize } from '../middleware/authorization.js';
import { sendEmail } from '../utils/emails.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedSaltedPassword = await bcrypt.hash(password, 10);
    if (!loginValidation(req.body.email, hashedSaltedPassword)) {
      res.status(400).render('login', { error: 'Missing required fields' });
      return;
    }
    const user = await dbUser.getUserByEmail(email);
    if (!user) {
      res.status(401).render('login', { error: 'Invalid email or password' });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (user && match) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.status(401).render('login', { error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}`, user: req.session.user });
  }
});

router.get('/signup', (req, res) => {
  try {
    res.render('signup', { error: null });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}`, user: req.session.user });
  }
});

router.post('/signup', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    const validationResult = signupValidation(name, email, password, password2);
    if (validationResult !== 'Ok') {
      res.status(400).render('signup', { error: validationResult });
      return;
    }
    const hashedSaltedPassword = await bcrypt.hashSync(password, 10);
    const newUser = {
      name,
      email,
      role: 'student',
      password: hashedSaltedPassword,
      classes: [],
    };
    await dbUser.createUser(newUser);
    res.redirect('/login');
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}`, user: req.session.user });
  }
});

router.get('/logout', async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect('/login');
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}`, user: req.session.user });
  }
});

router.get('/invite', authorize('teacher'), (req, res) => {
  try {
    res.render('invite', { error: null, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

router.post('/invite', authorize('teacher'), express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { email } = req.body;
    await sendEmail(email);
    res.status(200).render('invite', { error: 'Email sent!', user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

export default router;
