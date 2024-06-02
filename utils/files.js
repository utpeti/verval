import multer from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync, unlink, readFile } from 'fs';

// File muveletek kezelese

const uploadDir = join(process.cwd(), 'uploaded-files');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

export const multerUploader = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Egy file nevenek lekerese
export const getFileName = (file) => file.filename;

// Egy file eleresi utvonalanak lekerese
export const getFile = (filename) => join(uploadDir, filename);

// Egy file torlese
export const deleteFile = async (filename) => {
  const filePath = getFile(filename);
  await unlink(filePath, (err) => {
    if (err) {
      console.error(`File delete unsuccessful: ${err.message}`);
    }
  });
};

// Egy file kuldese a kliensnek
export const displayFile = (filePath, res) => {
  readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).render('error', { message: `File read unsuccessful: ${err.message}` });
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.send(data);
    }
  });
};
