import express from 'express';
import { classValidation } from '../validations/classValidation.js';
import * as dbClass from '../database/classes.js';
import * as dbUser from '../database/users.js';
import * as dbGrades from '../database/grades.js';
import * as dbAssignment from '../database/assignments.js';
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
    let users = await dbUser.getAllUsers();
    users = users.filter((user) => user._id.toString() !== req.session.user._id);
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
  const classData = dbClass.getClass(classID);
  if (toString(classData.owner) !== req.session.user._id) {
    res.status(403).send({ message: 'You are not the owner of this class' });
    return;
  }
  dbClass
    .deleteClass(classID)
    .then(() => res.status(200).send({ message: 'Class deleted successfully' }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// csatlakozott felhasznalok listazasa egy classnal
router.get('/class/:classID/joinedlist', authorize(['teacher']), async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    const users = await Promise.all(
      classData.users.map(async (userID) => {
        const user = await dbUser.getUser(userID);
        if (user) {
          return user;
        }
        return null;
      }),
    );
    const filteredUsers = users.filter((user) => user != null);
    res.render('joinedlist', { user: req.session.user, classData, users: filteredUsers });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// jegyek listazasa egy usernek egy classban
router.get('/class/:classID/grades', authorize(['student']), async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    const gradesData = await dbGrades.getGradesOfStudentInClass(req.session.user._id, req.params.classID);
    const finalData = await Promise.all(
      gradesData.map(async (line) => {
        const assignment = await dbAssignment.getAssignment(line.assignment);
        return {
          assignment: assignment.name,
          assignmentID: assignment._id,
          grade: line.grade,
          weight: assignment.weight,
        };
      }),
    );
    const allGrades = await Promise.all(
      gradesData.map(async (grade) => {
        if (grade.grade !== null && grade.grade !== undefined) {
          const assignment = await dbAssignment.getAssignment(grade.assignment);
          const weight = assignment.weight / 100;
          if (weight === 0) {
            return null;
          }
          return weight * grade.grade;
        }
        return null;
      }),
    );
    const filteredGrades = allGrades.filter((grade) => grade != null);
    let finalGrade = 0;
    if (filteredGrades.length > 0) {
      while (filteredGrades.length > 0) {
        finalGrade += filteredGrades.pop();
      }
    }
    finalGrade = Math.round(finalGrade * 100) / 100;
    res.render('grades', { gradesData, user: req.session.user, finalData, classData, finalGrade });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

export default router;
