import bcrypt from 'bcryptjs';
import db from './index';

const password = bcrypt.hashSync('password', 8);

const populate = `
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Mariquilla', 'Greenhough', 'mgreenhough0@noaa.gov', '${password}', 08012223340, '41 Forest Dale Plaza', 'unverified', false, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Bentlee', 'Dedam', 'bdedam1@bigcartel.com', '${password}',  08012223341, '41 Forest Dale Plaza', 'verified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Lissy', 'Krink', 'lkrink2@rakuten.co.jp', '${password}', 08012223342, '41 Forest Dale Plaza', 'verified', false, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Veronique', 'McGrory', 'vmcgrory3@cdbaby.com', '${password}', 08012223343, '41 Forest Dale Plaza', 'unverified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Candis', 'Lakeman', 'clakeman4@amazonaws.com', '${password}', 08012223344, '41 Forest Dale Plaza', 'unverified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Karalynn', 'Arlott', 'karlott5@scientificamerican.com',  '${password}', 08012223345, '41 Forest Dale Plaza', 'unverified', false, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Britney', 'Spillett', 'bspillett6@japanpost.jp', '${password}', 08012223346, '41 Forest Dale Plaza', 'unverified', false, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Hervey', 'Jorioz', 'hjorioz7@bravesites.com', '${password}', 08012223347, '41 Forest Dale Plaza', 'verified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Theresa', 'Groucutt', 'tgroucutt8@bbb.org', '${password}', 08012223348, '41 Forest Dale Plaza', 'unverified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, address, status, isadmin, registered) VALUES (default, 'Isa', 'Scuse', 'iscuse9@tamu.edu', '${password}', 08012223349, '41 Forest Dale Plaza', 'unverified', false, default);

  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Mariquilla', 'Greenhough', 'mgreenhough0@noaa.gov', 104000, 3, 'pending', false, 35246.04, 105738.12, 1738.12, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Bentlee', 'Dedam', 'bdedam1@bigcartel.com', 112000, 3, 'approved', false, 37957.28, 113871.84, 1871.84, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Lissy', 'Krink', 'lkrink2@rakuten.co.jp', 70000, 5, 'pending', false, 14351.94, 71759.7, 1759.7, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Veronique', 'McGrory', 'vmcgrory3@cdbaby.com', 83000, 4, 'pending', false, 21184.09, 84736.36, 1736.36, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Candis', 'Lakeman', 'clakeman4@amazonaws.com', 77000, 10, 'approved', true, 8057.31, 0, 3573.1, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Karalynn', 'Arlott', 'karlott5@scientificamerican.com', 21000, 8, 'approved', false, 2724.39, 21795.12, 795.12, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Britney', 'Spillett', 'bspillett6@japanpost.jp', 32000, 9, 'pending', false, 3705.34, 33348.06, 1348.06, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Hervey', 'Jorioz', 'hjorioz7@bravesites.com', 150000, 7, 'approved', false, 22148.78, 155041.46, 5041.46, default);
`;

const seedDatabase = async () => {
  await db.query(populate).then(() => {
    console.log('Tables populated successfully');
  });
};

seedDatabase();
