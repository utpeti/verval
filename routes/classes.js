import express from 'express';
import { classValidation } from '../validations/classValidation.js';
import * as dbClass from '../database/classes.js';
import * as dbUser from '../database/users.js';

// router az osztalyokhoz kapcsolodo endpointokhoz

const router = express.Router();

// Az osszes osztaly lekerese es ez a fooldal is
router.get(['/', '/allclasses'], async (req, res) => {
  try {
    const classes = await dbClass.getClasses();
    res.render('allclasses', { classes });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// Egy class lekerese
router.get('/class/:classID', async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    res.render('class', { classData });
  } catch (err) {
    res.status(500).render('error', { message: "Class doesn't exist" });
  }
});

// Egy class hozzaadasa
router.get('/addclass', async (req, res) => {
  try {
    const users = await dbUser.getUsers();
    res.render('addclass', { users, error: '' });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// Egy class hozzaadasa (POST)
router.post('/addclass', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    if (!classValidation(req.body)) {
      const users = await dbUser.getUsers();
      res.status(400).render('addclass', { users, error: 'Missing required fields' });
      return;
    }
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
      res.json({ success: true, description: classItem.description });
    } else {
      res.json({ success: false, message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Egy class torlese
router.delete('/deleteclass', express.json(), (req, res) => {
  const { classID } = req.body;
  dbClass
    .deleteClass(classID)
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json({ success: false, message: err.message }));
});

export default router;
