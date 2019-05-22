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
  password: 'Ilove0dogs#',
};

let userToken;
let adminToken;

describe('POST /loans/:id/repayment', () => {
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
  it('should not make payment if ID is invalid', async () => {
    const id = 'abc';
    const res = await request.post(`/api/v1/loans/${id}/repayment`).send({ amount: 10000 }).set('authorization', `${adminToken}`);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('Should not make Payment if amount is invalid', async () => {
    const id = 4;
    const res = await request.post(`/api/v1/loans/${id}/repayment`).send({ amount: '234ed$' });
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('It should not Make Payment if Loan is not approved', async () => {
    const id = 7;
    const res = await request.post(`/api/v1/loans/${id}/repayment`).send({ amount: 40000 }).set('authorization', `${adminToken}`);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('should not make payment if loan has been fully repaid', async () => {
    const id = 5;
    const res = await request.post(`/api/v1/loans/${id}/repayment`).send({ amount: 40000 }).set('authorization', `${adminToken}`);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('should not make payment if Loan with given ID does not exist', async () => {
    const id = 999;
    const res = await request.post(`/api/v1/loans/${id}/repayment`).send({ amount: 40000 }).set('authorization', `${adminToken}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(404);
  });
  it('should make Payment if all checks are passed', async () => {
    const id = 6;
    const amount = 2724.39;
    const res = await request.post(`/api/v1/loans/${id}/repayment`).send({ amount }).set('authorization', `${adminToken}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.data.should.have.property('loanId').eql(id);
    res.body.data.should.have.property('paidAmount').eql(amount);
    res.body.data.should.have.property('amount');
    res.body.data.should.have.property('balance');
  });
  it('should make Payments and change repaid to true when Loan payment is complete', async () => {
    const id = 8;
    const amount = 155042;
    const res = await request.post(`/api/v1/loans/${id}/repayment`).send({ amount }).set('authorization', `${adminToken}`);
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.data.should.have.property('loanId').eql(id);
    res.body.data.should.have.property('paidAmount').eql(amount);
    res.body.data.should.have.property('amount');
    res.body.data.should.have.property('balance');
    res.body.data.should.have.property('repaid').eql(true);
  });
});

describe('GET /loans/:id/repayments', () => {
  it('Should NOT return list of repayments if ID is invalid', async () => {
    const id = 'etc';
    const res = await request.get(`/api/v1/loans/${id}/repayments`);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('Should NOT return list of repayments if ID is not found', async () => {
    const id = 999;
    const res = await request.get(`/api/v1/loans/${id}/repayments`).set('authorization', `${userToken}`);
    res.should.have.status(404);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(404);
  });
  it('Should return list of repayments', async () => {
    const id = 6;
    const res = await request.get(`/api/v1/loans/${id}/repayments`).set('authorization', `${userToken}`);
    res.should.have.status(200);
    res.body.should.have.property('data');
    res.body.data.should.be.a('array');
    res.body.data[0].should.have.property('loanid').eql(id);
    res.body.data[0].should.have.property('amount');
  });
});
