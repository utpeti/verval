import mongoose from 'mongoose';

// adatbazishoz collection semak definialasa

// assignmentek
const assignmentSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duedate: {
    type: Date,
    required: true,
  },
  descriptionFile: {
    type: String,
    required: true,
  },
});
export const Assignment = mongoose.model('Assignment', assignmentSchema);

// osztalyok
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
});
export const Class = mongoose.model('Class', classSchema);

// felhasznalok
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher'],
  },
  password: {
    type: String,
    required: true,
  },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  invitations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});
export const User = mongoose.model('User', userSchema);

const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  token: {
    type: String,
    required: true,
  },
});
export const Invitation = mongoose.model('Invitation', invitationSchema);
