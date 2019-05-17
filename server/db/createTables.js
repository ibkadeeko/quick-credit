import db from './index';

const createTables = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    phone VARCHAR(11) NOT NULL UNIQUE,
    status VARCHAR(10) NOT NULL CHECK(status IN ('verified', 'unverified')) DEFAULT 'unverified',
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    registered DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id, email)
  );

  CREATE TABLE IF NOT EXISTS loans (
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL REFERENCES users(email),
    amount NUMERIC NOT NULL CHECK(10000 <= amount AND amount <= 200000),
    tenor NUMERIC NOT NULL CHECK(0 < tenor AND tenor <= 12),
    status VARCHAR(10) NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    repaid BOOLEAN NOT NULL DEFAULT false,
    paymentInstallment NUMERIC NOT NULL,
    balance NUMERIC NOT NULL,
    interest NUMERIC NOT NULL,
    createdOn DATE NOT NULL DEFAULT CURRENT_DATE
  );
  
  CREATE TABLE IF NOT EXISTS repayments (
    id SERIAL NOT NULL PRIMARY KEY,
    loanid INT NOT NULL REFERENCES loans(id),
    amount NUMERIC NOT NULL CHECK(amount > 0),
    createdon DATE NOT NULL DEFAULT CURRENT_DATE
  );
`;

const createDatabaseTables = async () => {
  await db.query(createTables).then(() => {
    console.log('Tables successfully created');
  });
};

createDatabaseTables();
