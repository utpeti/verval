import express from 'express';
import { join } from 'path';
import { existsSync, mkdirSync, unlink } from 'fs';
import morgan from 'morgan';
import multer from 'multer';

const classes = [];

const publicDir = join(process.cwd(), 'public');
const app = express();
app.use(morgan('common'));
app.use(express.static(publicDir));

function classesAdd(code, description) {
  const newClass = {
    code,
    description,
    assignments: [],
  };
  classes.push(newClass);
}

function getIndexByCode(code) {
  return classes.findIndex((element) => element.code === code);
}

app.post('/addclass', express.urlencoded({ extended: true }), (req, res) => {
  if (!(req.body.code && req.body.description)) {
    res.status(400).send('Missing required fields.');
    return;
  }

  if (classes[getIndexByCode(req.body.code)] !== undefined) {
    res.status(400).send('Class already exists.');
    return;
  }

  const serverResponse = `Following class has been added:
  CODE: ${req.body.code}
  DESCRIPTION: ${req.body.description}
  `;

  classesAdd(req.body.code, req.body.description);
  res.set('Content-Type', 'text/plain;charset=utf-8');
  res.send(serverResponse);
});

function deleteClass(code) {
  classes.splice(getIndexByCode(code), 1);
}

app.post('/deleteclass', express.urlencoded({ extended: true }), (req, res) => {
  if (classes[getIndexByCode(req.body.code)] === undefined) {
    res.status(400).send("Class doesn't exists.");
    return;
  }
  deleteClass(req.body.code);
  const serverResponse = `Following class has been deleted:
    CODE: ${req.body.code}
  `;
  res.set('Content-Type', 'text/plain;charset=utf-8');
  res.send(serverResponse);
});

const uploadDir = join(process.cwd(), 'uploaded-files');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

const multerUploader = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

function assignmentAdd(code, description, deadline, filename, size) {
  const assignment = {
    code,
    description,
    deadline,
    file: {
      name: filename,
      size,
    },
  };
  classes[getIndexByCode(code)].assignments.push(assignment);
}

app.post('/addassignment', multerUploader.single('uploadedfile'), (req, res) => {
  let successfullUpload = true;
  if (!(req.body.code && req.body.description && req.body.deadline)) {
    res.status(400).send('Missing required fields.');
    successfullUpload = false;
  }

  if (classes[getIndexByCode(req.body.code)] === undefined) {
    res.status(400).send("Class doesn't exists.");
    successfullUpload = false;
  }

  if (!req.file) {
    res.status(400).send('No file uploaded.');
    successfullUpload = false;
  }

  if (req.file.size > 10 * 1024 * 1024) {
    res.status(400).send('File too large.');
    successfullUpload = false;
  }

  if (new Date(req.body.deadline) <= new Date()) {
    res.status(400).send('Invalid date.');
    successfullUpload = false;
  }

  if (!req.file.mimetype.match(/^application\/pdf$/)) {
    res.status(400).send('Invalid file type.');
    successfullUpload = false;
  }

  if (!successfullUpload) {
    unlink(`./uploaded-files/${req.file.filename}`, (err) => {
      if (err) {
        console.error(err);
      }
    });
    return;
  }

  assignmentAdd(req.body.code, req.body.description, req.body.deadline, req.file.originalname, req.file.size);
  const serverResponse = `Following assignment has been added:
    CLASS CODE: ${req.body.code}
    DESCRIPTION: ${req.body.description}
    DATE: ${req.body.deadline}
    FILE: ${req.file.originalname}
    SIZE: ${req.file.size} bytes
  `;
  res.set('Content-Type', 'text/plain;charset=utf-8');
  res.send(serverResponse);
});

app.listen(8000, () => {
  console.log('Server listening...');
});
