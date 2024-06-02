// Bejelentkezes validalasa
export function loginValidation(email, password) {
  if (!(email && password)) {
    return false;
  }
  return true;
}
