import mongoose from 'mongoose';

// kapcsolodas a MongoDB-hez
export const connectToDatabase = () => {
  mongoose.connect('mongodb://root:webprog_project@localhost:27017/');
  const db = mongoose.connection;
  // kapcsolat ellenorzese
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  // ha minden ok, akkor kiirjuk, hogy sikeres a kapcsolat
  db.once('open', () => console.log('Database connected'));
};
