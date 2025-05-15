import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

const { assert } = chai;
chai.use(chaiHttp);

describe('Integration Tests', () => {

  it('Should retrieve a CSRF token', (done) => {
    chai
      .request(app)
      .get('/form')
      .end((err, res) => {
        assert.equal(res.statusCode, 200);
        assert.isString(res.body.csrfToken);
        done();
      });
  });

  describe('Cohort Endpoints', () => {
    let testCohortId;

    it('Should create a new cohort', (done) => {
      chai
        .request(app)
        .post('/api/cohorts')
        .send({ name: 'Test Cohort' })
        .end((err, res) => {
          assert.equal(res.statusCode, 201);
          assert.isObject(res.body);
          assert.property(res.body, '_id');
          testCohortId = res.body._id;
          done();
        });
    });

    it('Should retrieve all cohorts', (done) => {
      chai
        .request(app)
        .get('/api/cohorts')
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.isArray(res.body);
          done();
        });
    });

    it('Should retrieve a cohort by ID', (done) => {
      chai
        .request(app)
        .get(`/api/cohorts/${testCohortId}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.isObject(res.body);
          assert.property(res.body, '_id');
          done();
        });
    });

    it('Should update a cohort', (done) => {
      chai
        .request(app)
        .put(`/api/cohorts/${testCohortId}`)
        .send({ name: 'Updated Cohort' })
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.property(res.body, 'name');
          assert.equal(res.body.name, 'Updated Cohort');
          done();
        });
    });

    it('Should delete a cohort', (done) => {
      chai
        .request(app)
        .delete(`/api/cohorts/${testCohortId}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          done();
        });
    });
  });

});
