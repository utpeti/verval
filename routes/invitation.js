import express from 'express';
import bcrypt from 'bcrypt';
import * as dbUser from '../database/users.js';
import * as dbInvitation from '../database/invitations.js';
import { invitationValidation } from '../validations/signupValidation.js';

const router = express.Router();

router.get('/invitedsignup/', (req, res) => {
  try {
    res.render('invitedsignup', { error: null, signInToken: req.query.token });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

router.post('/invitedsignup/:signInToken', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { name, password, password2 } = req.body;
    const validationResult = invitationValidation(name, password, password2);
    if (validationResult !== 'Ok') {
      res.status(400).render('invitedsignup', { error: validationResult, signInToken: req.params.signInToken });
      return;
    }
    const invitation = await dbInvitation.getInvitationByToken(req.params.signInToken);
    if (invitation === undefined || invitation.token !== req.params.signInToken) {
      res.status(401).render('invitedsignup', { error: 'Invalid sign in token', signInToken: req.params.signInToken });
      return;
    }
    const hashedSaltedPassword = await bcrypt.hashSync(password, 10);
    const newUser = {
      name,
      email: invitation.email,
      role: 'teacher',
      password: hashedSaltedPassword,
      classes: [],
    };
    await dbUser.createUser(newUser);
    await dbInvitation.deleteInvitation(invitation.email);
    res.redirect('/login');
  } catch (err) {
    res.status(500).render('error', { message: 'ERROR: Invalid token' });
  }
});

export default router;
