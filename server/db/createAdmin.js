import bcrypt from 'bcryptjs';
import db from './index';

const password = bcrypt.hashSync('password', 8);

const values = [
  'admin',
  'admin',
  'admin@quickcredit.com',
  password,
  '08003000200',
  '26 Lighthouse Bay Center',
  'verified',
  true,
];
const queryText = 'INSERT INTO users (firstname, lastname, email, password, phone, address, status, isAdmin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

const seedDatabase = async () => {
  await db.query(queryText, values).then(() => {
    console.log('Admin Successfully Created');
  });
};

seedDatabase();
