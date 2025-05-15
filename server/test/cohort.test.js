const request = require('supertest');
const app = require('../app.js');

describe('Cohort API', () => {
  test('should create a new cohort', async () => {
    const response = await request(app)
      .post('/api/cohorts')
      .send({ 
        cohortSlug: "test-slug",
        cohortName: "Test Cohort",
        program: "Web Development",
        format: "Full-Time",
        campus: "New York",
        startDate: "2025-05-01",
        endDate: "2025-12-01",
        inProgress: false,
        programManager: "John Doe",
        leadTeacher: "Jane Smith",
        totalHours: 400
      });
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.cohortName).toBe('Test Cohort');
  });
});