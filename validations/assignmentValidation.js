// Assignment validacio
export function assignmentValidation(assignmentData, fileData) {
  if (!(assignmentData.name && assignmentData.description && assignmentData.deadline)) {
    return 'Missing required fields';
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
