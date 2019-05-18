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

describe('PATCH /users/:email/verify', () => {
  it('It SHOULD NOT work if email is invalid', async () => {
    const email = '1xae4rg2';
    const res = await request.patch(`/api/v1/users/${email}/verify`);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('should NOT UPDATE if user email is not in the database', async () => {
    const email = 'mikemikemike@yahoo.com';
    const res = await request.patch(`/api/v1/users/${email}/verify`);
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(404);
  });
  it('SHOULD VERIFY the user', async () => {
    const email = 'tomblack@mandela.com';
    const res = await request.patch(`/api/v1/users/${email}/verify`);
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
