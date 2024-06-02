// regisztracio validalasa
export function signupValidation(name, email, password, password2) {
  if (!(name && email && password && password2)) {
    return 'Missing required fields';
  }
  if (password !== password2) {
    return 'Passwords do not match';
  }
  return 'Ok';
}

export function invitationValidation(name, password, password2) {
  if (!(name && password && password2)) {
    return 'Missing required fields';
  }
  if (password !== password2) {
    return 'Passwords do not match';
  }
  return 'Ok';
}
