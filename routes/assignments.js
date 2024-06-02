import express from 'express';
import { getFile, displayFile, deleteFile, multerUploader } from '../utils/files.js';
import { assignmentValidation } from '../validations/assignmentValidation.js';
import * as dbClass from '../database/classes.js';
import * as dbAssignment from '../database/assignments.js';
import { authorize } from '../middleware/authorization.js';

// router az assignmentekhez kapcsolodo endpointokhoz

const router = express.Router();

// Az osszes assignment lekerese egy classbol
router.get('/class/:classID/assignments', async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    const assignments = await dbClass.getAssignmentsOfClass(classData._id);
    res.render('assignments', { classData, assignments, user: req.session.user });
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

export default router;
