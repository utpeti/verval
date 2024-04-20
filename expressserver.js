import express from 'express';

const app = express();

app.get('/', (req, res) => {
  console.log('Hello World');
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server is listening...');
});
