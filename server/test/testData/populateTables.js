import db from '../../db';

const populate = `
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Mariquilla', 'Greenhough', 'mgreenhough0@noaa.gov', 'ar0Qcw5gT', 08012223340, 'unverified', false, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Bentlee', 'Dedam', 'bdedam1@bigcartel.com', 'u2Rb1uwC',  08012223341, 'verified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Lissy', 'Krink', 'lkrink2@rakuten.co.jp', 'lgKVaTCFGHHe', 08012223342, 'verified', false, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Veronique', 'McGrory', 'vmcgrory3@cdbaby.com', 'Ky2PPhK', 08012223343, 'unverified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Candis', 'Lakeman', 'clakeman4@amazonaws.com', 'Uf8cpVqGqmER', 08012223344, 'unverified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Karalynn', 'Arlott', 'karlott5@scientificamerican.com',  'advervcYY', 08012223345, 'unverified', false, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Britney', 'Spillett', 'bspillett6@japanpost.jp', 'b4WHNczDd4l', 08012223346, 'unverified', false, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Hervey', 'Jorioz', 'hjorioz7@bravesites.com', 'SdyaRDF99e', 08012223347, 'verified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Theresa', 'Groucutt', 'tgroucutt8@bbb.org', 'XTvuFao',  08012223348, 'unverified', true, default);
  INSERT INTO users (id, firstname, lastname, email, password, phone, status, isadmin, registered) VALUES (default, 'Isa', 'Scuse', 'iscuse9@tamu.edu', 'gnpL3v', 08012223349, 'unverified', false, default);

  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Mariquilla', 'Greenhough', 'mgreenhough0@noaa.gov', 104000, 3, 'pending', false, 35246.04, 105738.12, 1738.12, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Bentlee', 'Dedam', 'bdedam1@bigcartel.com', 112000, 3, 'approved', false, 37957.28, 113871.84, 1871.84, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (default, 'Lissy', 'Krink', 'lkrink2@rakuten.co.jp', 70000, 5, 'pending', false, 14351.94, 71759.7, 1759.7, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (7, 'Veronique', 'McGrory', 'vmcgrory3@cdbaby.com', 83000, 4, 'pending', false, 21184.09, 84736.36, 1736.36, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (8, 'Candis', 'Lakeman', 'clakeman4@amazonaws.com', 77000, 10, 'approved', true, 8057.31, 0, 3573.1, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (10, 'Karalynn', 'Arlott', 'karlott5@scientificamerican.com', 21000, 8, 'approved', false, 2724.39, 21795.12, 795.12, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (11, 'Britney', 'Spillett', 'bspillett6@japanpost.jp', 32000, 9, 'pending', false, 3705.34, 33348.06, 1348.06, default);
  INSERT INTO loans (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) VALUES  (16, 'Hervey', 'Jorioz', 'hjorioz7@bravesites.com', 150000, 7, 'approved', false, 22148.78, 155041.46, 5041.46, default);
`;

const seedDatabase = async () => {
  await db.query(populate).then(() => {
    console.log('Tables populated successfully');
  });
};

before(async () => {
  await seedDatabase();
});
