import { Invitation } from './schemas.js';

// Fuggvenyek az invitation-hoz kapcsolodo adatbazis muveletekhez
export const saveInvitation = (invitationData) => {
  const newInvitation = new Invitation({
    email: invitationData.email,
    token: invitationData.token,
  });
  return newInvitation.save();
};

export const getInvitationByEmail = (email) => Invitation.find({ email });

export const getInvitationByToken = (token) => Invitation.findOne({ token }).then((invitation) => invitation);

export const deleteInvitation = (email) => Invitation.deleteOne({ email });
