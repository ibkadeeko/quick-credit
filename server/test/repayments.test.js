import chai from 'chai';
import chaiHttp from 'chai-http';
import { it, describe } from 'mocha';

import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('POST /loans/:id/repayment', () => {
  it('should not make payment if ID is invalid', (done) => {
    const id = 'abc';
    chai.request(app)
      .post(`/api/v1/loans/${id}/repayment`)
      .send({ amount: 10000 })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('Should not make Payment if amount is invalid', (done) => {
    const id = 7;
    chai.request(app)
      .post(`/api/v1/loans/${id}/repayment`)
      .send({ amount: '234ed$' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('It should not Make Payment if Loan is not approved', (done) => {
    const id = 11;
    chai.request(app)
      .post(`/api/v1/loans/${id}/repayment`)
      .send({ amount: 40000 })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('should not make payment if loan has been fully repaid', (done) => {
    const id = 8;
    chai.request(app)
      .post(`/api/v1/loans/${id}/repayment`)
      .send({ amount: 40000 })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(400);
        done(err);
      });
  });
  it('should not make payment if Loan with given ID does not exist', (done) => {
    const id = 999;
    chai.request(app)
      .post(`/api/v1/loans/${id}/repayment`)
      .send({ amount: 40000 })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.should.have.property('status').eql(404);
        done(err);
      });
  });
  it('should make Payment if all checks are passed', (done) => {
    const id = 10;
    const amount = 2724.39;
    chai.request(app)
      .post(`/api/v1/loans/${id}/repayment`)
      .send({ amount })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.have.property('loanId').eql(id);
        res.body.data.should.have.property('paidAmount').eql(amount);
        res.body.data.should.have.property('amount');
        res.body.data.should.have.property('balance');
        done(err);
      });
  });
  it('should make Payments and change repaid to true when Loan payment is complete', (done) => {
    const id = 16;
    const amount = 155042;
    chai.request(app)
      .post(`/api/v1/loans/${id}/repayment`)
      .send({ amount })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.have.property('loanId').eql(id);
        res.body.data.should.have.property('paidAmount').eql(amount);
        res.body.data.should.have.property('amount');
        res.body.data.should.have.property('balance');
        res.body.data.should.have.property('repaid').eql(true);
        done(err);
      });
  });
});
