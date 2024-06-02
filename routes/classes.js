import express from 'express';
import { classValidation } from '../validations/classValidation.js';
import * as dbClass from '../database/classes.js';
import * as dbUser from '../database/users.js';
import { authorize } from '../middleware/authorization.js';

// router az osztalyokhoz kapcsolodo endpointokhoz

const router = express.Router();

// Az osszes osztaly lekerese es ez a fooldal is
router.get(['/', '/allclasses'], async (req, res) => {
  try {
    const classes = await dbClass.getClasses();
    res.render('allclasses', { classes, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// Egy class lekerese
router.get('/class/:classID', async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    res.render('class', { classData, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: "Class doesn't exist" });
  }
});

// Egy class hozzaadasa
router.get('/addclass', authorize(['teacher']), async (req, res) => {
  try {
    const users = await dbUser.getAllUsers();
    res.render('addclass', { users, error: '', user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// Egy class hozzaadasa (POST)
router.post('/addclass', express.urlencoded({ extended: true }), authorize(['teacher']), async (req, res) => {
  try {
    if (!classValidation(req.body)) {
      const users = await dbUser.getAllUsers();
      res.status(400).render('addclass', { users, error: 'Missing required fields', user: req.session.user });
      return;
    }
    req.body.owner = req.session.user._id;
    const newClass = await dbClass.createClass(req.body);
    newClass.users.forEach((user) => dbUser.addClassToUser(user, newClass._id));
    res.redirect('/');
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// Class leiras megjelenitese
router.get('/class/showmore/:classID', async (req, res) => {
  const currentClassID = req.params.classID;
  try {
    const classItem = await dbClass.getClass(currentClassID);
    if (classItem) {
      res.status(200).json({ description: classItem.description });
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Egy class torlese
router.delete('/deleteclass', express.json(), authorize(['teacher']), (req, res) => {
  const { classID } = req.body;
  dbClass
    .deleteClass(classID)
    .then(() => res.status(200).send({ message: 'Class deleted successfully' }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

export default router;
