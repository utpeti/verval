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

    if (typeof classID !== 'string' || !classID.trim()) {
      return res.status(400).json({ message: 'Invalid class ID' });
    }

    const userId = req.session?.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await dbUser.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await dbUser.addClassToUser(user._id, classID);
    await dbClass.addUserToClass(classID, user._id);
    await dbUser.deleteInvitationFromUser(user, classID);

    return res.status(200).json({ message: 'Invitation accepted' });
  } catch (err) {
    console.error('Error in /acceptinvitation:', err);
    return res.status(500).json({ message: `ERROR: ${err.message}` });
  }
});

router.post('/declineinvitation', express.json(), authorize('student'), async (req, res) => {
  try {
    const { classID } = req.body.classID;
    const user = await dbUser.getUser(req.session.user._id);
    await dbClass.declineInvitation(classID, user);
    await dbUser.deleteInvitationFromUser(user, classID);
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

export default router;
