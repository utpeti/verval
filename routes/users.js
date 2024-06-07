import express from 'express';
import * as dbUser from '../database/users.js';
import * as dbClass from '../database/classes.js';
import * as dbGrades from '../database/grades.js';
import { authorize } from '../middleware/authorization.js';

const router = express.Router();

// (projekt)
// vizsgaljuk, hogy a felhasznalo role-ja valtozott-e, ha igen, akkor frissitjuk a session-t
router.use((req, res, next) => {
  if (req.session.user) {
    dbUser.getUser(req.session.user._id).then((user) => {
      if (user.role !== req.session.user.role) {
        req.session.destroy();
        res.redirect('/login');
      }
      next();
    });
  } else {
    next();
  }
});

// osszes user lekerese es listazasa
router.get('/listusers', authorize('teacher'), async (req, res) => {
  try {
    const users = await dbUser.getAllUsers();
    const classes = await dbClass.getClassesOfOwner(req.session.user._id);
    res.render('listusers', { users, user: req.session.user, classes });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// user torlese
router.delete('/deleteuser', express.json(), authorize('teacher'), (req, res) => {
  const { userID } = req.body;
  dbUser
    .deleteUser(userID)
    .then(() => res.status(200).send({ message: 'User deleted' }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// user role-janak modositasa
router.post('/edituser', express.json(), authorize('teacher'), async (req, res) => {
  const { userID, role } = req.body;
  const user = await dbUser.getUser(userID);
  const prevRole = user.role;
  if (prevRole === 'student' && role === 'teacher') {
    await dbGrades.deleteGradesOfStudent(userID);
  }
  if (prevRole === 'teacher' && role === 'student') {
    const userWithClasses = await dbUser.getClassesOfUser(userID);
    const userClasses = userWithClasses.classes;
    userClasses.forEach(async (classID) => {
      await dbClass.deleteUserFromClass(classID, userID);
      await dbUser.deleteClassFromUser(userID, classID);
    });
  }
  dbUser
    .editUser(userID, role)
    .then(() => res.status(200).send({ message: 'User edited' }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// user hozzaadasa egy classhoz (meghivas kuldes)
router.post('/addusertoclass', express.json(), authorize('teacher'), (req, res) => {
  const { userID, classID } = req.body;
  dbUser
    .addInvitationToUser(userID, classID)
    .then(() => res.status(200).send({ message: 'Invitation sent' }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

export default router;
