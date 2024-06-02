import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import * as dbInvitation from '../database/invitations.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = (email) => {
  dbInvitation.deleteInvitation(email);
  const inviteToken = bcrypt.hashSync(email, 10);
  const newInvitation = {
    email,
    token: inviteToken,
  };
  dbInvitation.saveInvitation(newInvitation);
  const text = `Hello, you have been invited to join our platform.
Please click on the link below to sign up:
http://localhost:8000/invitedsignup?token=${inviteToken}`;
  const message = {
    from: 'ecatalog@invitation.ro',
    to: email,
    subject: 'Invitation to join eCatalog',
    text,
  };
  transporter.sendMail(message, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
