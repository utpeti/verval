import { User } from './schemas.js';

// Fuggvenyek a userekhez kapcsolodo adatbazis muveletekhez

// Egy user lekerese
export const getUser = (userID) => User.findById(userID);

// Az osszes user lekerese
export const getUsers = () => User.find();

// Egy user letrehozasa
export const createUser = (userData) => {
  const newUser = new User({
    name: userData.name,
    email: userData.email,
    role: userData.role,
    classes: [],
  });
  return newUser.save();
};

// Egy user hozzaadasa egy classhoz
export const addClassToUser = (userID, classID) => {
  getUser(userID).then((user) => {
    user.classes.push(classID);
    return user.save();
  });
};

// Egy user torlese egy classbol
export const deleteClassFromUser = (userID, classID) => {
  getUser(userID).then((user) => {
    user.classes.pull(classID);
    return user.save();
  });
};

// Az osszes user lekerese egy classtol
export const getUsersClasses = (userID) => {
  getUser(userID).then((user) => user.classes);
};
