// Class validacio
export function classValidation(classData) {
  if (!classData.name || !classData.description) {
    return false;
  }
  return true;
}
