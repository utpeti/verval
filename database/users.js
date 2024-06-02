import { User } from './schemas.js';
import * as dbClass from './classes.js';

// Fuggvenyek a userekhez kapcsolodo adatbazis muveletekhez

// Egy user lekerese
export const getUser = (userID) => User.findById(userID);

// Egy user lekerese email alapjan
export const getUserByEmail = (email) => User.findOne({ email });

// Az osszes user lekerese
export const getAllUsers = () => User.find().sort({ name: 1 });

// Egy user letrehozasa
export const createUser = (userData) => {
  const newUser = new User({
    name: userData.name,
    email: userData.email,
    role: userData.role,
    password: userData.password,
    classes: [],
    invitations: [],
  });
  return newUser.save();
};

// Egy user hozzaadasa egy classhoz
export const addClassToUser = async (userID, classID) => {
  try {
    const user = await getUser(userID);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.classes.includes(classID)) {
      user.classes.push(classID);
      await user.save();
      await dbClass.addUserToClass(classID, userID);
    }
  } catch (error) {
    console.error(`Error adding class to user: ${error.message}`);
    throw error;
  }
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

// Egy user torlese
export const deleteUser = async (userID) => {
  await User.findByIdAndDelete(userID);
};

// Egy user role-janak modositasa
export const editUser = async (userID, role) => {
  await User.findByIdAndUpdate(userID, { role });
};

// Egy user osztalyainak lekerese
export const getClassesOfUser = (userID) => User.findById(userID).populate('classes');

// Hozzadasa egy meghivonak egy userhez (projekt)
export const addInvitationToUser = async (userID, classID) => {
  await getUser(userID).then((user) => {
    if (user.invitations.includes(classID)) {
      throw new Error('Invitation already sent');
    } else if (user.classes.includes(classID)) {
      throw new Error('User already in class');
    }
    user.invitations.push(classID);
    return user.save();
  });
};

// Meghivo torlese egy usertol (projekt)
export const deleteInvitationFromUser = async (userID, classID) => {
  await getUser(userID).then((user) => {
    user.invitations.pull(classID);
    return user.save();
  });
};
