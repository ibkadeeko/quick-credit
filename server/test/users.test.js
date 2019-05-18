import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { it, describe } from 'mocha';

import app from '../app';
import UserModel from '../models/userModel';

chai.use(chaiHttp);
chai.should();

describe('PATCH /users/:email/verify', () => {
  it('It SHOULD NOT work if email is invalid', (done) => {
    const email = '1xae4rg2';
    chai.request(app)
      .patch(`/api/v1/users/${email}/verify`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('should NOT UPDATE if user email is not in the database', (done) => {
    const email = 'mikemikemike@yahoo.com';
    chai.request(app)
      .patch(`/api/v1/users/${email}/verify`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(404);
        done(err);
      });
  });
  it('SHOULD VERIFY the user', (done) => {
    const email = 'tomblack@mandela.com';
    chai.request(app)
      .patch(`/api/v1/users/${email}/verify`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('status').eql('verified');
        res.body.data.should.have.property('email').eql(email);
        done(err);
      });
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
