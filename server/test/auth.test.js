import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import { it, describe } from 'mocha';
import app from '../app';

chai.use(chaiHttp);
chai.should();

let request;
beforeEach(() => {
  request = chai.request(app);
});

describe('POST auth/signup', () => {
  it('SHOULD NOT register the user if firstname is omitted', async () => {
    const newUser = {
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      phone: 18007593000,
      password: 'Ilove0cats#',
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT register the user if lastname is omitted', async () => {
    const newUser = {
      firstName: 'michael',
      email: 'mikewagner@andela.com',
      phone: 18007593000,
      password: 'Ilove0cats#',
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT register the user if email is omitted', async () => {
    const newUser = {
      firstName: 'michael',
      lastName: 'wagner',
      phone: 18007593000,
      password: 'Ilove0cats#',
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT register the user if phone number is omitted', async () => {
    const newUser = {
      firstName: 'michael',
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      password: 'Ilove0cats#',
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT register the user if password is omitted', async () => {
    const newUser = {
      firstName: 'michael',
      lastName: 'wagner',
      email: 'mikewagner@andela.com',
      phone: 18007593000,
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD NOT register the user if password is less than 6 characters', async () => {
    const newUser = {
      firstName: 'michael',
      lastName: 'wagner',
      password: 'six',
      email: 'mikewagner@andela.com',
      phone: 18007593000,
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(400);
  });
  it('SHOULD register the user if user doesn\'t exist', async () => {
    const newUser = {
      firstName: 'Tom',
      lastName: 'huddlestone',
      email: 'tomblack@mandela.com',
      phone: 19002000800,
      password: 'Ilove0dogs#',
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(201);
    res.body.should.have.property('status').eql(201);
    res.body.should.be.a('object');
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('token');
  });
  it('SHOULD NOT register the user if user already exists', async () => {
    const newUser = {
      firstName: 'Tom',
      lastName: 'huddlestone',
      email: 'tomblack@mandela.com',
      phone: 19002000800,
      password: 'Ilove0dogs#',
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(409);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(409);
  });
  it('SHOULD not register the user if there are conflicting unique parameters', async () => {
    const newUser = {
      firstName: 'Nigel',
      lastName: 'henderson',
      email: 'nigelhenderson@great.com',
      phone: 19002000800,
      password: 'Ilovelove#',
    };
    const res = await request.post('/api/v1/auth/signup').send(newUser);
    res.should.have.status(409);
    res.body.should.have.property('status').eql(409);
  });
});

describe('POST auth/login', () => {
  it('SHOULD NOT login the user if user is not found', async () => {
    const loginDetails = {
      email: 'aaronkramer@hotmail.com',
      password: 'Ilove0cats#',
    };
    const res = await request.post('/api/v1/auth/login').send(loginDetails);
    res.should.have.status(404);
    res.body.should.have.property('error');
    res.body.should.have.property('status').eql(404);
  });
  it('SHOULD NOT login the user if email is omitted', async () => {
    const loginDetails = {
      password: 'Ilove0dogs#',
    };
    const res = await request.post('/api/v1/auth/login').send(loginDetails);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('SHOULD NOT login the user if password field is omitted', async () => {
    const loginDetails = {
      email: 'tomblack@mandela.com',
    };
    const res = await request.post('/api/v1/auth/login').send(loginDetails);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('SHOULD NOT login the user if password is wrong', async () => {
    const loginDetails = {
      email: 'tomblack@mandela.com',
      password: 'Ilovdogs#',
    };
    const res = await request.post('/api/v1/auth/login').send(loginDetails);
    res.should.have.status(401);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('SHOULD login the user if user is found', async () => {
    const loginDetails = {
      email: 'tomblack@mandela.com',
      password: 'Ilove0dogs#',
    };
    const res = await request.post('/api/v1/auth/login').send(loginDetails);
    res.should.have.status(200);
    res.body.should.have.property('status').eql(200);
    res.body.should.be.a('object');
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('token');
  });
});

const email = 'tomblack@mandela.com';
const fakeEmail = 'ibkizzles@outlook.com';
const token = jwt.sign({ email }, process.env.SECRETkey, { expiresIn: '3h' });
const fakeToken = jwt.sign({ fakeEmail }, process.env.SECRETkey, { expiresIn: '3h' });

describe('POST /reset', () => {
  it('Should not reset if email is omitted', async () => {
    const res = await request.post('/api/v1/auth/reset');
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not reset if user is not found', async () => {
    const res = await request.post('/api/v1/auth/reset').send({ email: fakeEmail });
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should send reset email', async () => {
    const res = await request.post('/api/v1/auth/reset').send({ email });
    res.should.have.status(200);
    res.body.should.have.property('status').eql(200);
    res.body.should.be.a('object');
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('message').eql('Reset Password Email Successfully Sent');
  });
});

describe('POST /resetpassword', () => {
  it('Should not reset password if password is omitted', async () => {
    const res = await request.post(`/api/v1/auth/resetpassword?token=${token}`);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not reset password if token is omitted', async () => {
    const res = await request.post('/api/v1/auth/resetpassword').send({ password: '123456' });
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should not reset password if email is not in database', async () => {
    const res = await request.post(`/api/v1/auth/resetpassword?token=${fakeToken}`).send({ password: '123456' });
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
  });
  it('Should reset password', async () => {
    const res = await request.post(`/api/v1/auth/resetpassword?token=${token}`).send({ password: '123456' });
    res.should.have.status(200);
    res.body.should.have.property('status').eql(200);
    res.body.should.be.a('object');
    res.body.data.should.be.a('object');
  });
});
