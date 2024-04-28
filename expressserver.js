import express from 'express';
import { join } from 'path';
import { existsSync, mkdirSync, unlink } from 'fs';
import morgan from 'morgan';
import multer from 'multer';

// ebben az arrayben fogom tarolni az osztalyokat
const classes = [];

const publicDir = join(process.cwd(), 'public');
const app = express();
app.use(morgan('common'));
app.use(express.static(publicDir));

// ebben a fuggvenyben adok hozza egy osztalyt az arrayhez
function classesAdd(code, description) {
  const newClass = {
    code,
    description,
    assignments: [],
  };
  classes.push(newClass);
}

// ez a fuggveny fontos volt, hogy a kulonbozo tantargyakat az arrayen belul a tantargyak
// egyedi kodja alapjan tudjam megkapni
function getIndexByCode(code) {
  return classes.findIndex((element) => element.code === code);
}

// kulonbozo endpointok a formokhoz illetve segedfuggvenyek a tantargyak es feladatok hozzaadasahoz
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

function classesDelete(code) {
  classes.splice(getIndexByCode(code), 1);
}

app.post('/deleteclass', express.urlencoded({ extended: true }), (req, res) => {
  if (classes[getIndexByCode(req.body.code)] === undefined) {
    res.status(400).send("Class doesn't exists.");
    return;
  }
  classesDelete(req.body.code);
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
  } else if (classes[getIndexByCode(req.body.code)] === undefined || classes.length === 0) {
    res.status(400).send("Class doesn't exists.");
    successfullUpload = false;
  } else if (!req.file) {
    res.status(400).send('No file uploaded.');
    successfullUpload = false;
  } else if (req.file.size > 10 * 1024 * 1024) {
    res.status(400).send('File too large.');
    successfullUpload = false;
  } else if (new Date(req.body.deadline) <= new Date()) {
    res.status(400).send('Invalid date.');
    successfullUpload = false;
  } else if (!req.file.mimetype.match(/^application\/pdf$/)) {
    res.status(400).send('Invalid file type.');
    successfullUpload = false;
  }

  if (!successfullUpload) {
    unlink(`./uploaded-files/${req.file.filename}`, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error.');
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
