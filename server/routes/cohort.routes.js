const router = require("express").Router();
const createError = require('http-errors');
const Cohort = require("../models/cohort.model.js");

router.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find({});
    res.status(200).json(cohorts);
  } catch (err) {
    next(createError(500, 'Failed to retrieve cohorts'));
  }
});

router.get('/api/cohorts/:cohortId', async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) return next(createError(404, 'Cohort not found'));
    res.status(200).json(cohort);
  } catch (err) {
    next(createError(500, 'Failed to fetch cohort'));
  }
});

router.post('/api/cohorts', async (req, res, next) => {
  try {
    const createdCohort = await Cohort.create(req.body);
    res.status(201).json(createdCohort);
  } catch (err) {
    next(createError(500, 'Failed to create the cohort'));
  }
});

router.put('/api/cohorts/:cohortId', async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const cohort = await Cohort.findByIdAndUpdate(cohortId, req.body, { new: true });
    if (!cohort) return next(createError(404, 'Cohort not found'));
    res.status(200).json(cohort);
  } catch (err) {
    next(createError(500, 'Failed to update cohort'));
  }
});

router.delete('/api/cohorts/:cohortId', async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const cohort = await Cohort.findByIdAndDelete(cohortId);
    if (!cohort) return next(createError(404, 'Cohort not found'));
    res.status(200).json(cohort);
  } catch (err) {
    next(createError(500, 'Failed to delete cohort'));
  }
});

module.exports = router;