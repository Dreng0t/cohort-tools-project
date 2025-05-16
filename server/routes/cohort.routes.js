const router = require("express").Router();
const createError = require('http-errors');
const Cohort = require("../models/cohort.model.js");

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find({});
    res.status(200).json(cohorts);
  } catch (err) {
    next(createError(500, 'Failed to retrieve cohorts'));
  }
});

router.get('/cohorts/:cohortId', async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) return next(createError(404, 'Cohort not found'));
    res.status(200).json(cohort);
  } catch (err) {
    next(createError(500, 'Failed to fetch cohort'));
  }
});

router.post('/cohorts', isAuthenticated, async (req, res, next) => {
  try {
    const createdCohort = await Cohort.create(req.body);
    res.status(201).json(createdCohort);
  } catch (err) {
    console.error("Error in POST /cohorts:", err);  
    next(createError(500, err.message));
  }
});

router.put('/cohorts/:cohortId', isAuthenticated, async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const cohort = await Cohort.findByIdAndUpdate(cohortId, req.body, { new: true });
    if (!cohort) return next(createError(404, 'Cohort not found'));
    res.status(200).json(cohort);
  } catch (err) {
    next(createError(500, 'Failed to update cohort'));
  }
});

router.delete('/cohorts/:cohortId', isAuthenticated, async (req, res, next) => {
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