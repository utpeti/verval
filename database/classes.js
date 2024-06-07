import { Class, Assignment, User, Grades } from './schemas.js';
import { deleteFile } from '../utils/files.js';

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
    owner: classData.owner,
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

// Minden osztaly lekerese egy userhez, aki az ownerje az osztalynak
export const getClassesOfOwner = (ownerID) => Class.find({ owner: ownerID });

// Egy user hozzaadasa egy osztalyhoz
export const addUserToClass = async (classID, userID) => {
  await Class.findByIdAndUpdate(classID, {
    $push: { users: userID },
  });
  const assignmentsOfClass = await getAssignmentsOfClass(classID);
  assignmentsOfClass.forEach((assignment) => {
    const newGrades = new Grades({
      class: classID,
      assignment,
      user: userID,
      grade: null,
    });
    newGrades.save();
  });
};

// Minden user lekerese egy classbol
export const getUsersOfClass = async (classID) => {
  const classData = await Class.findById(classID).populate('users').exec();
  return classData ? classData.users : [];
};

// Egy user torlese egy osztalybol
export const deleteUserFromClass = (classID, userID) =>
  Class.findByIdAndUpdate(classID, {
    $pull: { users: userID },
  });
