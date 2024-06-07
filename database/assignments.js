import { Assignment, Class } from './schemas.js';
import { deleteFile } from '../utils/files.js';
import * as dbGrade from './grades.js';

// Fuggvenyek az assignmentekhez kapcsolodo adatbazis muveletekhez

// Egy assignment lekerese
export const getAssignment = (assignmentID) => Assignment.findById(assignmentID);

// Assignment keszitese
export const createAssignment = (classID, assignmentData, fileName) => {
  const newAssignment = new Assignment({
    class: classID,
    name: assignmentData.name,
    weight: assignmentData.weight,
    description: assignmentData.description,
    duedate: assignmentData.deadline,
    descriptionFile: fileName,
  });
  dbGrade.createGradesForAssignment(newAssignment._id, classID);
  return newAssignment.save();
};

// Egy assignment torlese
export const deleteAssignment = async (assignmentID) => {
  await Assignment.findById(assignmentID).then((assignment) => {
    deleteFile(assignment.descriptionFile);
  });
  await Class.updateMany({}, { $pull: { assignments: assignmentID } });
  await dbGrade.deleteGradesOfAssignment(assignmentID);
  await Assignment.findByIdAndDelete(assignmentID);
};

// Egy classhoz tartozo assignmentek torlese
export const deleteAssignmentsOfClass = (classID) => {
  Assignment.deleteMany({ class: classID });
};
