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

describe('Root Route', () => {
  it('should display Welcome on root route', async () => {
    const res = await request.get('/');
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.data.should.have.property('message').eql('Welcome to Quick Credit API v1');
  });
});

describe('Invalid Route', () => {
  it('should display 404 error', async () => {
    const res = await request.get('/invalid/route');
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error').eql('The Route you are requesting for does not exist');
  });
});
