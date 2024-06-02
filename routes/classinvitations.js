import express from 'express';
import * as dbClass from '../database/classes.js';
import * as dbUser from '../database/users.js';
import { authorize } from '../middleware/authorization.js';

const router = express.Router();

// (projekt)

// Meghivasok listazasa
router.get('/invitations', authorize('student'), async (req, res) => {
  try {
    const user = await dbUser.getUser(req.session.user._id);
    const classPromises = user.invitations.map((classID) => dbClass.getClass(classID));
    const classes = await Promise.all(classPromises);
    res.render('invitations', { invitations: classes, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

router.post('/acceptinvitation', express.json(), authorize('student'), async (req, res) => {
  try {
    const { classID } = req.body;
    const user = await dbUser.getUser(req.session.user._id);
    await dbUser.addClassToUser(user, classID);
    await dbUser.deleteInvitationFromUser(user, classID);
    res.status(200).json({ message: 'Invitation accepted' });
  } catch (err) {
    res.status(500).json({ message: `ERROR: ${err.message}` });
  }
});

router.post('/declineinvitation', authorize('student'), async (req, res) => {
  try {
    const { classID } = req.body.classID;
    const user = await dbUser.getUser(req.session.user._id);
    await dbClass.declineInvitation(classID, user);
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

export default router;
