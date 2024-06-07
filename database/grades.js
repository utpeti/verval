import { Grades } from './schemas.js';
import * as dbClass from './classes.js';

// Fuggvenyek a jegyekhez kapcsolodo adatbazis muveletekhez (projekt)

// Osszes jegy lekerese egy diaknak minden classre
export const getGradesOfStudent = (userID) => Grades.find({ user: userID }).sort({ class: 1 });

// Osszes jegy lekerese egy classban egy diaknak
export const getGradesOfStudentInClass = (userID, classID) => Grades.find({ user: userID, class: classID });

// Osszes jegy lekerese egy assignmenthez
export const getGradesOfAssignment = (assignmentID) => Grades.find({ assignment: assignmentID });

// jegyek letrehozasa egy assignmenthez minden diaknak
export const createGradesForAssignment = async (assignmentID, classID) => {
  const users = await dbClass.getUsersOfClass(classID);
  users.forEach((user) => {
    if (user.role === 'student') {
      const newGrades = new Grades({
        class: classID,
        assignment: assignmentID,
        user: user._id,
        grade: null,
      });
      newGrades.save();
    }
  });
};

// jegyek torlese egy assignmenthez minden diaknak
export const deleteGradesOfAssignment = (assignmentID) => Grades.deleteMany({ assignment: assignmentID });

// jegyek torlese egy diakhtol
export const deleteGradesOfStudent = (userID) => Grades.deleteMany({ user: userID });

// jegy modositasa egy diaknak egy assignmentben
export const updateGrade = async (userID, assignmentID, grade) => {
  try {
    await Grades.findOneAndUpdate({ assignment: assignmentID, user: userID }, { $set: { grade } });
    console.log(`Grade updated successfully for user ${userID}, assignment ${assignmentID}`);
  } catch (error) {
    console.error(`Error updating grade for user ${userID}, assignment ${assignmentID}:`, error);
  }
};
