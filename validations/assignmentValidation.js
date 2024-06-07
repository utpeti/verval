// Assignment validacio
export function assignmentValidation(assignmentData, fileData) {
  if (!(assignmentData.name && assignmentData.description && assignmentData.deadline && assignmentData.weight)) {
    return 'Missing required fields';
  }
  if (Number.isNaN(assignmentData.weight) || assignmentData.weight < 0 || assignmentData.weight > 100) {
    return 'Invalid weight';
  }
  if (new Date(assignmentData.deadline) < new Date()) {
    return 'Invalid deadline';
  }
  if (!fileData) {
    return 'No file uploaded';
  }
  if (!fileData.mimetype.match(/^application\/pdf$/)) {
    return 'Invalid file type';
  }
  if (fileData.size > 10 * 1024 * 1024) {
    return 'File too large';
  }
  return 'Ok';
}
