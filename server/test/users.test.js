import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { it, describe } from 'mocha';

import app from '../app';
import UserModel from '../models/userModel';

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

let adminToken;

describe('PATCH /users/:email/verify', () => {
  before(async () => {
    try {
      const res = await chai.request(app).post('/api/v1/auth/login').send(adminDetails);
      adminToken = res.body.data.token;
    } catch (error) {
      console.error('Before Each Error msg:', error.message);
    }
  });
  it('It SHOULD NOT work if email is invalid', async () => {
    const email = '1xae4rg2';
    const res = await request.patch(`/api/v1/users/${email}/verify`);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('should NOT UPDATE if user email is not in the database', async () => {
    const email = 'mikemikemike@yahoo.com';
    const res = await request.patch(`/api/v1/users/${email}/verify`).set('authorization', `${adminToken}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(404);
  });
  it('SHOULD VERIFY the user', async () => {
    const email = 'tomblack@mandela.com';
    const res = await request.patch(`/api/v1/users/${email}/verify`).set('authorization', `${adminToken}`);
    res.should.have.status(200);
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('status').eql('verified');
    res.body.data.should.have.property('email').eql(email);
  });
});

const newUser = {
  firstName: 'Tom',
  lastName: 'huddlestone',
  email: 'tomblack@mandela.com',
  phone: 19002000800,
  password: 'Ilove0dogs#',
  status: 'unverified',
  isAdmin: false,
};

describe('USER Query Functions', () => {
  it('UserModel.create() should return an error', async () => {
    const result = await UserModel.create(newUser);
    expect(result).to.equal(false);
  });
});

const fakeEmail = 'ibkizzles@outlook.com';

describe('POST /reset_password', () => {
  it('Should not reset if email is omitted', async () => {
    const email = 'rbewrberbr';
    const res = await request.post(`/api/v1/users/${email}/reset_password`);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not reset if email is omitted', async () => {
    const email = '         ';
    const res = await request.post(`/api/v1/users/${email}/reset_password`);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not reset if user is not found', async () => {
    const res = await request.post(`/api/v1/users/${fakeEmail}/reset_password`);
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not change password if new password is omitted', async () => {
    const email = 'tomblack@mandela.com';
    const resetBody = {
      password: 'password',
    };
    const res = await request.post(`/api/v1/users/${email}/reset_password`).send(resetBody);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not change password if old password is omitted', async () => {
    const email = 'tomblack@mandela.com';
    const resetBody = {
      new_password: 'password',
    };
    const res = await request.post(`/api/v1/users/${email}/reset_password`).send(resetBody);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not change password if new password is less than 6 characters', async () => {
    const email = 'tomblack@mandela.com';
    const resetBody = {
      password: 'password',
      new_password: 'pass',
    };
    const res = await request.post(`/api/v1/users/${email}/reset_password`).send(resetBody);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not reset password if email is not in database', async () => {
    const resetBody = {
      password: 'password',
      new_password: 'password',
    };
    const res = await request.post(`/api/v1/users/${fakeEmail}/reset_password`).send(resetBody);
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not change password if password is wrong', async () => {
    const email = 'tomblack@mandela.com';
    const resetBody = {
      password: 'password',
      new_password: 'password',
    };
    const res = await request.post(`/api/v1/users/${email}/reset_password`).send(resetBody);
    res.should.have.status(401);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should change password', async () => {
    const email = 'tomblack@mandela.com';
    const resetBody = {
      password: 'Ilove0dogs#',
      new_password: 'password'
    };
    const res = await request.post(`/api/v1/users/${email}/reset_password`).send(resetBody);
    res.should.have.status(200);
    res.body.should.have.property('status').eql(200);
    res.body.should.be.a('object');
    res.body.data.should.be.a('object');
  });
  it('Should send reset email', async () => {
    const email = 'tomblack@mandela.com';
    const res = await request.post(`/api/v1/users/${email}/reset_password`);
    res.should.have.status(200);
    res.body.should.have.property('status').eql(200);
    res.body.should.be.a('object');
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('message').eql('Reset Password Email Successfully Sent');
  });
});
