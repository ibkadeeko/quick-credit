import chai from 'chai';
import chaiHttp from 'chai-http';
import { it, describe } from 'mocha';

import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('POST auth/signup', () => {
  it('SHOULD NOT register the user if firstname is omitted', (done) => {
    const newUser = {
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      phone: 18007593000,
      password: 'Ilove0cats#',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('SHOULD NOT register the user if lastname is omitted', (done) => {
    const newUser = {
      firstName: 'michael',
      email: 'mikewagner@andela.com',
      phone: 18007593000,
      password: 'Ilove0cats#',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('SHOULD NOT register the user if email is omitted', (done) => {
    const newUser = {
      firstName: 'michael',
      lastName: 'wagner',
      phone: 18007593000,
      password: 'Ilove0cats#',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('SHOULD NOT register the user if phone number is omitted', (done) => {
    const newUser = {
      firstName: 'michael',
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      password: 'Ilove0cats#',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('SHOULD NOT register the user if password is omitted', (done) => {
    const newUser = {
      firstName: 'michael',
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      phone: 18007593000,
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('SHOULD NOT register the user if password is less than 6 characters', (done) => {
    const newUser = {
      firstName: 'michael',
      lastName: 'wagner',
      password: 'six',
      email: 'mikewagner@andela.com',
      phone: 18007593000,
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('SHOULD register the user if user doesn\'t exist', (done) => {
    const newUser = {
      firstName: 'Tom',
      lastName: 'huddlestone',
      email: 'tomblack@mandela.com',
      phone: 19002000800,
      password: 'Ilove0dogs#',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('status').eql(201);
        res.body.should.be.a('object');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('token');
        done(err);
      });
  });
  it('SHOULD NOT register the user if user already exists', (done) => {
    const newUser = {
      firstName: 'Tom',
      lastName: 'huddlestone',
      email: 'tomblack@mandela.com',
      phone: 19002000800,
      password: 'Ilove0dogs#',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('SHOULD not register the user if there are conflicting unique parameters', (done) => {
    const newUser = {
      firstName: 'Nigel',
      lastName: 'henderson',
      email: 'nigelhenderson@great.com',
      phone: 19002000800,
      password: 'Ilovelove#',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
});
