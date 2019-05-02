import chai from 'chai';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import chaiHttp from 'chai-http';
import { it, describe } from 'mocha';
import app from '../app';

dotenv.config();

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

describe('POST auth/login', () => {
  it('SHOULD NOT login the user if user is not found', (done) => {
    const loginDetails = {
      email: 'aaronkramer@hotmail.com',
      password: 'Ilove0cats#',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('SHOULD NOT login the user if email is omitted', (done) => {
    const loginDetails = {
      password: 'Ilove0dogs#',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
      });
  });
  it('SHOULD NOT login the user if password field is omitted', (done) => {
    const loginDetails = {
      email: 'tomblack@mandela.com',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
      });
  });
  it('SHOULD NOT login the user if password is wrong', (done) => {
    const loginDetails = {
      email: 'tomblack@mandela.com',
      password: 'Ilovdogs#',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
      });
  });
  it('SHOULD login the user if user is found', (done) => {
    const loginDetails = {
      email: 'tomblack@mandela.com',
      password: 'Ilove0dogs#',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('token');
        done(err);
      });
  });
});

const email = 'tomblack@mandela.com';
const fakeEmail = 'ibkizzles@outlook.com'
const token = jwt.sign({ email }, process.env.SECRETkey, { expiresIn: '3h' });
const fakeToken = jwt.sign({ fakeEmail }, process.env.SECRETkey, { expiresIn: '3h' });

describe('POST /reset', () => {
  it('Should not reset if email is omitted', (done) => {
    chai.request(app)
      .post('/api/v1/auth/reset')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
      });
  });
  it('Should not reset if user is not found', (done) => {
    chai.request(app)
      .post('/api/v1/auth/reset')
      .send({ email: 'ibukunadeeko@outlook.com' })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
      });
  });
  it('Should send reset email', (done) => {
    chai.request(app)
      .post('/api/v1/auth/reset')
      .send({ email })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('message').eql('Reset Password Email Successfully Sent');
        done(err);
      });
  });
});

describe('POST /resetpassword', () => {
  it('Should not reset password if password is omitted', (done) => {
    chai.request(app)
      .post(`/api/v1/auth/resetpassword?token=${token}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
      });
  });
  it('Should not reset password if token is omitted', (done) => {
    chai.request(app)
      .post('/api/v1/auth/resetpassword')
      .send({ password: '123456' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
      });
  });
  it('Should not reset password if email is not in database', (done) => {
    chai.request(app)
      .post(`/api/v1/auth/resetpassword?token=${fakeToken}`)
      .send({ password: '123456' })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done(err);
      });
  });
  it('Should not reset password', (done) => {
    chai.request(app)
      .post(`/api/v1/auth/resetpassword?token=${token}`)
      .send({ password: '123456' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('object');
        done(err);
      });
  });
});
