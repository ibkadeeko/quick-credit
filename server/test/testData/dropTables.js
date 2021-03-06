import db from '../../db';

const dropTables = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS repayments CASCADE;
`;

const dropDatabase = async () => {
  await db.query(dropTables).then(() => {
    console.log('Tables successfully removed from Database');
  });
};

after(async () => {
  await dropDatabase();
});
