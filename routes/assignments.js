import express from 'express';
import { getFile, displayFile, deleteFile, multerUploader } from '../files/files.js';
import { assignmentValidation } from '../middleware/assignmentValidation.js';
import * as dbClass from '../database/classes.js';
import * as dbAssignment from '../database/assignments.js';

// router az assignmentekhez kapcsolodo endpointokhoz

const router = express.Router();

// Az osszes assignment lekerese egy classbol
router.get('/class/:classID/assignments', async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    const assignments = await dbClass.getAssignmentsOfClass(classData._id);
    res.render('assignments', { classData, assignments });
  } catch (err) {
    res.status(500).render('error', { message: "Class doesn't exist" });
  }
});

// Uj assignment hozzaadasa egy classhoz
router.get('/class/:classID/addassignment', async (req, res) => {
  try {
    const classData = await dbClass.getClass(req.params.classID);
    res.render('addassignment', { classData, error: '' });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// Uj assignment hozzaadasa egy classhoz (POST)
router.post('/class/:classID/addassignment', multerUploader.single('uploadedfile'), async (req, res) => {
  try {
    const validationResult = assignmentValidation(req.body, req.file);
    if (validationResult !== 'Ok') {
      const classData = await dbClass.getClass(req.params.classID);
      res.status(400).render('addassignment', { classData, error: validationResult });
      deleteFile(req.file.filename);
      return;
    }
    const assignment = await dbAssignment.createAssignment(req.params.classID, req.body, req.file.filename);
    await dbClass.addAssignmentToClass(req.params.classID, assignment._id);
    res.redirect(`/class/${req.params.classID}/assignments`);
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

// Egy assignmenthez tartozo file lekerese
router.get('/class/:classID/assignment/:assignmentID/uploaded-files/:filename', async (req, res) => {
  try {
    const filePath = await getFile(req.params.filename);
    displayFile(filePath, res);
  } catch (err) {
    res.status(500).render('error', { message: `File error: ${err.message}` });
  }
});

export default router;
