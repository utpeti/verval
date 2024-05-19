import { Class, Assignment, User } from './schemas.js';
import { deleteFile } from '../files/files.js';

// Fuggvenyek az osztalyokhoz kapcsolodo adatbazis muveletekhez

// Osszes osztaly lekerese
export const getClasses = () => Class.find();

// Egy osztaly lekerese
export const getClass = (classID) => Class.findById(classID);

// Egy osztaly letrehozasa
export const createClass = (classData) => {
  const newClass = new Class({
    name: classData.name,
    description: classData.description,
    users: classData.users,
    assignments: [],
  });
  return newClass.save();
};

// Egy osztalyhoz assignment hozzaadasa
export const addAssignmentToClass = (classID, assignmentID) =>
  Class.findByIdAndUpdate(classID, {
    $push: { assignments: assignmentID },
  });

// Egy assignment torlese az osztalybol
export const deleteAssignmentFromClass = (classID, assignmentID) =>
  Class.findByIdAndUpdate(classID, {
    $pull: { assignments: assignmentID },
  });

// Egy osztalyhoz tartozo assignmentek lekerese
export const getAssignmentsOfClass = (classID) => Assignment.find({ class: classID });

// Egy osztaly torlese
export const deleteClass = async (classID) => {
  await Assignment.find({ class: classID }).then((assignments) => {
    assignments.forEach((assignment) => {
      deleteFile(assignment.descriptionFile);
    });
  });
  // torolni kell a hozza tartozo assignmenteket is, frissiteni kell a usereket
  await Assignment.deleteMany({ class: classID });
  await User.updateMany({}, { $pull: { classes: classID } });
  await Class.findByIdAndDelete(classID, {
    $pull: { _id: classID },
  });
};
