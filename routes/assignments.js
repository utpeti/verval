import express from 'express';
import { getFile, displayFile, deleteFile, multerUploader } from '../utils/files.js';
import { assignmentValidation } from '../validations/assignmentValidation.js';
import * as dbClass from '../database/classes.js';
import * as dbAssignment from '../database/assignments.js';
import * as dbGrade from '../database/grades.js';
import * as dbUser from '../database/users.js';
import { authorize } from '../middleware/authorization.js';

// router az assignmentekhez kapcsolodo endpointokhoz

const router = express.Router();

// Az osszes assignment lekerese egy classbol
router.get('/class/:classID/assignments', async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    const assignments = await dbClass.getAssignmentsOfClass(classData._id);
    const assignmentData = assignments.map((assignment) => ({
      _id: assignment._id,
      class: assignment.class,
      name: assignment.name,
      description: assignment.description,
      duedate: assignment.duedate.toString().slice(0, 16),
      descriptionFile: assignment.descriptionFile,
    }));
    res.render('assignments', { classData, assignments: assignmentData, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: "Class doesn't exist" });
  }
});

// Uj assignment hozzaadasa egy classhoz
router.get('/class/:classID/addassignment', authorize('teacher'), async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    res.render('addassignment', { classData, error: '', user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// Uj assignment hozzaadasa egy classhoz (POST)
router.post(
  '/class/:classID/addassignment',
  multerUploader.single('uploadedfile'),
  authorize(['teacher']),
  async (req, res) => {
    try {
      const validationResult = assignmentValidation(req.body, req.file);
      if (validationResult !== 'Ok') {
        const classData = await dbClass.getClass(req.params.classID);
        res.status(400).render('addassignment', { classData, error: validationResult, user: req.session.user });
        deleteFile(req.file.filename);
        return;
      }
      const assignment = await dbAssignment.createAssignment(req.params.classID, req.body, req.file.filename);
      await dbClass.addAssignmentToClass(req.params.classID, assignment._id);
      res.redirect(`/class/${req.params.classID}/assignments`);
    } catch (err) {
      res.status(500).render('error', { message: `ERROR: ${err.message}` });
    }
  },
);

// Egy assignmenthez tartozo file lekerese
router.get('/class/:classID/assignment/:assignmentID/uploaded-files/:filename', async (req, res) => {
  try {
    const filePath = await getFile(req.params.filename);
    displayFile(filePath, res);
  } catch (err) {
    res.status(500).render('error', { message: `File error: ${err.message}` });
  }
});

// Egy assignment torlese
router.delete('/deleteassignment', express.json(), authorize(['teacher']), (req, res) => {
  const { assignmentID } = req.body;
  dbAssignment
    .deleteAssignment(assignmentID)
    .then(() => res.status(200).send({ message: 'Assignment deleted successfully' }))
    .catch((err) => res.status(500).json({ message: `ERROR: ${err.message}` }));
});

// egy feladat pontozasainak megjelenitese
router.get('/class/:classID/assignment/:assignmentID/grade', authorize(['teacher']), async (req, res) => {
  const { classID, assignmentID } = req.params;
  try {
    const classData = await dbClass.getClass(classID);
    const allGradesForAssignment = await dbGrade.getGradesOfAssignment(assignmentID);
    const assignmentGradesData = await Promise.all(
      allGradesForAssignment.map(async (grade) => {
        const student = await dbUser.getUser(grade.user);
        return {
          assignmentID: grade.assignment._id.toString(),
          studentID: student._id,
          studentName: student.name,
          grade: grade.grade,
        };
      }),
    );
    res.status(200).render('gradesperassignment', { assignmentGradesData, user: req.session.user, classData });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

router.post('/savegrades', express.json(), authorize(['teacher']), async (req, res) => {
  try {
    const assignmentGrades = req.body;
    if (!Array.isArray(assignmentGrades)) {
      res.status(400).send({ message: 'Invalid data format' });
    }
    const updatePromises = assignmentGrades.map(({ studentID, assignmentID, grade }) => {
      console.log(studentID, assignmentID, grade);
      return dbGrade.updateGrade(studentID, assignmentID, grade);
    });
    await Promise.all(updatePromises);
    const updatedGrades = await dbGrade.getGradesOfAssignment(assignmentGrades[0].assignmentID);
    res.status(200).send({ message: 'Grades updated successfully', updatedGrades });
  } catch (error) {
    console.error('Error updating grades:', error);
    res.status(500).send({ message: 'Failed to update grades' });
  }
});

// feladat statisztikai adatainak lekerese
router.get('/assignment/:assignmentID/statistics', express.json(), authorize(['student']), async (req, res) => {
  const { assignmentID } = req.params;
  try {
    const allGradesForAssignment = await dbGrade.getGradesOfAssignment(assignmentID);
    const grades = allGradesForAssignment.map((grade) => grade.grade);
    const mean = grades.reduce((acc, grade) => acc + grade, 0) / grades.length;
    const min = Math.min(...grades);
    const max = Math.max(...grades);
    res.status(200).send({ mean, min, max });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

export default router;
