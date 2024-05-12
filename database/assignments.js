import { Assignment } from './schemas.js';
import { deleteFile } from '../files/files.js';

// Fuggvenyek az assignmentekhez kapcsolodo adatbazis muveletekhez

// Egy assignment lekerese
export const getAssignment = (assignmentID) => Assignment.findById(assignmentID);

// Assignment keszitese
export const createAssignment = (classID, assignmentData, fileName) => {
  const newAssignment = new Assignment({
    class: classID,
    name: assignmentData.name,
    description: assignmentData.description,
    duedate: assignmentData.deadline,
    descriptionFile: fileName,
  });
  return newAssignment.save();
};

// Egy assignment torlese
export const deleteAssignment = (assignmentID) => {
  const assignment = Assignment.findById(assignmentID);
  if (assignment.descriptionFile) {
    deleteFile(assignment.descriptionFile);
  }
  Assignment.findByIdAndDelete(assignmentID);
};

// Egy classhoz tartozo assignmentek torlese
export const deleteAssignmentsOfClass = (classID) => {
  Assignment.deleteMany({ class: classID });
};
