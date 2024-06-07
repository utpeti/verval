import express from 'express';
import * as dbGrade from '../database/grades.js';
import * as dbAssignment from '../database/assignments.js';
import * as dbClass from '../database/classes.js';
import { authorize } from '../middleware/authorization.js';

// (projekt)
// router a diakok jegyeinek es feladatainak lekeresehez (osszes, nem csak egy classban)

const router = express.Router();

// osszes jegy lekerese egy diaknak minden classre
router.get('/grades', authorize(['student']), async (req, res) => {
  try {
    const gradesData = await dbGrade.getGradesOfStudent(req.session.user._id);
    const finalData = await Promise.all(
      gradesData.map(async (line) => {
        const assignment = await dbAssignment.getAssignment(line.assignment);
        const classFE = await dbClass.getClass(assignment.class);
        return {
          assignment: assignment.name,
          grade: line.grade,
          class: classFE.name,
        };
      }),
    );
    res.render('stdgrades', { gradesData, user: req.session.user, finalData });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

router.get('/assignments', authorize(['student']), async (req, res) => {
  try {
    const gradesData = await dbGrade.getGradesOfStudent(req.session.user._id);
    const finalData = await Promise.all(
      gradesData.map(async (line) => {
        const assignment = await dbAssignment.getAssignment(line.assignment);
        const classFE = await dbClass.getClass(assignment.class);
        return {
          assignment: assignment.name,
          grade: line.grade,
          class: classFE.name,
          deadline: assignment.duedate.toString().slice(0, 16),
        };
      }),
    );
    res.render('stdassignments', { gradesData, user: req.session.user, finalData });
  } catch (err) {
    res.status(500).render('error', { message: `ERROR: ${err.message}` });
  }
});

export default router;
