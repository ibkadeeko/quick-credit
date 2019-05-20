import chai from 'chai';
import chaiHttp from 'chai-http';
import { it, describe } from 'mocha';

import app from '../app';

chai.use(chaiHttp);
chai.should();

let request;
beforeEach(() => {
  request = chai.request(app);
});

const adminDetails = {
  email: 'admin@quickcredit.com',
  password: 'password',
};

const userDetails = {
  email: 'tomblack@mandela.com',
  password: '123456',
};

let userToken;
let adminToken;

const malformedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjEsImVtYWlsIjoicG9saXRpY29hZG1pbkBwb2xpdGljby5jb20iLCJpc2FkbWluIjp0cnVlLCJpYXQiOjE1NTA3NjM4MjksImV4cCI6MTU1MDc4NTQyOX0.Ta3DQLDQxn-59WDZETWpBawcFsvfBzNa74PMF40_mWg';

describe('POST /loans', () => {
  before(async () => {
    try {
      const response = await chai.request(app).post('/api/v1/auth/login').send(userDetails);
      const res = await chai.request(app).post('/api/v1/auth/login').send(adminDetails);
      userToken = response.body.data.token;
      adminToken = res.body.data.token;
    } catch (error) {
      console.error('Before Each Error msg:', error.message);
    }
  });
  it('SHOULD NOT submit the loan Form if firstName is omitted', async () => {
    const loanApplication = {
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT submit the loan Form if lastName is omitted', async () => {
    const loanApplication = {
      firstName: 'michael',
      email: 'mikewagner@andela.com',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT submit the loan Form if email is omitted', async () => {
    const loanApplication = {
      firstName: 'michael',
      lastName: 'wagner',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT submit the loan Form if amount is omitted', async () => {
    const loanApplication = {
      firstName: 'michael',
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT submit the loan Form if tenor is omitted', async () => {
    const loanApplication = {
      firstName: 'michael',
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      amount: 100000,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT submit the form if amount is not between 10000 and 200000', async () => {
    const loanApplication = {
      firstName: 'michael',
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      amount: 1000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT submit the form if tenor is not between 1 and 12', async () => {
    const loanApplication = {
      firstName: 'michael',
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      amount: 100000,
      tenor: 60,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT submit the form if User has a Pending Loan Application', async () => {
    const loanApplication = {
      firstName: 'Tod',
      lastName: 'Mahog',
      email: 'mgreenhough0@noaa.gov',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication).set('authorization', `${userToken}`);
    res.should.have.status(409);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(409);
  });
  it('SHOULD NOT submit the form if User has an unpaid Loan', async () => {
    const loanApplication = {
      firstName: 'Tod',
      lastName: 'Mahog',
      email: 'bdedam1@bigcartel.com',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication).set('authorization', `${userToken}`);
    res.should.have.status(409);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(409);
  });
  it('SHOULD NOT submit the form without a token', async () => {
    const loanApplication = {
      firstName: 'Tom',
      lastName: 'huddlestone',
      email: 'tomblack@mandela.com',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication);
    res.should.have.status(401);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(401);
  });
  it('SHOULD NOT submit the form if Token is malformed', async () => {
    const loanApplication = {
      firstName: 'Tom',
      lastName: 'huddlestone',
      email: 'tomblack@mandela.com',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication).set('authorization', `${malformedToken}`);
    res.should.have.status(401);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(401);
  });
  it('SHOULD submit the form', async () => {
    const loanApplication = {
      firstName: 'Tom',
      lastName: 'huddlestone',
      email: 'tomblack@mandela.com',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication).set('authorization', `Bearer ${userToken}`);
    res.should.have.status(201);
    res.body.should.have.property('status').eql(201);
    res.body.should.be.a('object');
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('status').eql('pending');
    res.body.data.should.have.property('amount').eql(100000);
    res.body.data.should.have.property('tenor').eql(6);
  });
  it('SHOULD submit the form if User has Repaid ALL loans', async () => {
    const loanApplication = {
      firstName: 'Candis',
      lastName: 'Lakeman',
      email: 'clakeman4@amazonaws.com',
      amount: 100000,
      tenor: 6,
    };
    const res = await request.post('/api/v1/loans').send(loanApplication).set('authorization', `${userToken}`);
    res.should.have.status(201);
    res.body.should.have.property('status').eql(201);
    res.body.should.be.a('object');
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('status').eql('pending');
    res.body.data.should.have.property('amount').eql(100000);
    res.body.data.should.have.property('tenor').eql(6);
  });
});

describe('GET /loans', () => {
  it('SHOULD return a list of all Loans', async () => {
    const res = await request.get('/api/v1/loans').set('authorization', `${adminToken}`);
    res.should.have.status(200);
    res.body.should.have.property('status').eql(200);
    res.body.should.be.a('object');
    res.body.data.should.be.a('array');
    res.body.data[0].should.have.property('amount');
    res.body.data[0].should.have.property('tenor');
    res.body.data[0].should.have.property('interest');
  });
  it('SHOULD return a list of all REPAID loans', async () => {
    const res = await request.get('/api/v1/loans?status=approved&repaid=true').set('authorization', `${adminToken}`);
    res.should.have.status(200);
    res.body.should.have.property('status').eql(200);
    res.body.should.be.a('object');
    res.body.data.should.be.a('array');
    res.body.data[0].should.have.property('status').eql('approved');
    res.body.data[0].should.have.property('repaid').eql(true);
  });
  it('SHOULD return a list of all UNREPAID loans', async () => {
    const res = await request.get('/api/v1/loans?status=approved&repaid=false').set('authorization', `${adminToken}`);
    res.should.have.status(200);
    res.body.should.have.property('status').eql(200);
    res.body.should.be.a('object');
    res.body.data.should.be.a('array');
    res.body.data[0].should.have.property('status').eql('approved');
    res.body.data[0].should.have.property('repaid').eql(false);
  });
  it('SHOULD NOT return a List of Loans', async () => {
    const res = await request.get('/api/v1/loans?status=pending&repaid=false');
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT return a List of Loans', async () => {
    const res = await request.get('/api/v1/loans?home=something').set('authorization', `Bearer ${adminToken}`);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT return a List of Loans if No Token is Provided', async () => {
    const res = await request.get('/api/v1/loans');
    res.should.have.status(401);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(401);
  });
  it('SHOULD NOT return a List of Loans if Token is Invalid', async () => {
    const res = await request.get('/api/v1/loans').set('authorization', `${malformedToken}`);
    res.should.have.status(401);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(401);
  });
  it('SHOULD NOT return a List of Loans if user is unauthorized', async () => {
    const res = await request.get('/api/v1/loans').set('authorization', `${userToken}`);
    res.should.have.status(403);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(403);
  });
});

describe('Get /loans/:id', () => {
  it('It SHOULD NOT work if id is not a number', async () => {
    const id = '1xae4rg2';
    const res = await request.get(`/api/v1/loans/${id}`);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('should NOT LIST a single Loan if ID is not in database', async () => {
    const id = 999;
    const res = await request.get(`/api/v1/loans/${id}`).set('authorization', `${userToken}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(404);
  });
  it('should LIST a SINGLE Loan', async () => {
    const id = 1;
    const res = await request.get(`/api/v1/loans/${id}`).set('authorization', `${userToken}`);
    res.should.have.status(200);
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('id');
    res.body.data.id.should.equal(id);
    res.body.data.should.have.property('amount');
    res.body.data.should.have.property('tenor');
    res.body.data.should.have.property('interest');
  });
});

describe('PATCH /loans/:id', () => {
  it('It SHOULD NOT work if id is not a number', async () => {
    const id = '1xae4rg2';
    const res = await request.patch(`/api/v1/loans/${id}`).send({ status: 'approved' });
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('should NOT UPDATE if ID is not in the database', async () => {
    const id = 999;
    const res = await request.patch(`/api/v1/loans/${id}`).send({ status: 'approved' }).set('authorization', `${adminToken}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(404);
  });
  it('should NOT update if status is not approved or rejected', async () => {
    const id = 1;
    const res = await request.patch(`/api/v1/loans/${id}`).send({ status: 'something' });
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD UPDATE the Loan Application', async () => {
    const id = 1;
    const res = await request.patch(`/api/v1/loans/${id}`).send({ status: 'approved' }).set('authorization', `${adminToken}`);
    res.should.have.status(200);
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('id').eql(id);
    res.body.data.should.have.property('status').eql('approved');
  });
  it('SHOULD UPDATE the Loan Application', async () => {
    const id = 3;
    const res = await request.patch(`/api/v1/loans/${id}`).send({ status: 'rejected' }).set('authorization', `${adminToken}`);
    res.should.have.status(200);
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('id').eql(id);
    res.body.data.should.have.property('status').eql('rejected');
  });
  it('should NOT update if previous loan Application has been taken', async () => {
    const id = 3;
    const res = await request.patch(`/api/v1/loans/${id}`).send({ status: 'approved' }).set('authorization', `${adminToken}`);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
});
