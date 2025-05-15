const router = require("express").Router();

const Cohort = require("../models/cohort.model.js");

router.get("/api/cohorts", (req, res, next) => {
  Cohort.find({})
    .then(cohorts => res.status(200).json(cohorts))
    .catch(err => next(createError(500, 'Failed to retrieve cohorts')));
});

router.get('/api/cohorts/:cohortId', (req, res, next) => {
  let { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then(cohort => {
      if (!cohort) return next(createError(404, 'Cohort not found'));
      res.status(200).json(cohort);
    })
    .catch(err => next(createError(500, 'Failed to fetch cohort')));
});

router.post('/api/cohorts', (req, res, next) => {
  Cohort.create(req.body)
    .then(createdCohort => res.status(201).json(createdCohort))
    .catch(err => next(createError(500, 'Failed to create the cohort')));
});

router.put('/api/cohorts/:cohortId', (req, res, next) => {
  let { cohortId } = req.params;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then(cohort => {
      if (!cohort) return next(createError(404, 'Cohort not found'));
      res.status(200).json(cohort);
    })
    .catch(err => next(createError(500, 'Failed to update cohort')));
});

router.delete('/api/cohorts/:cohortId', (req, res, next) => {
  let { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then(cohort => {
      if (!cohort) return next(createError(404, 'Cohort not found'));
      res.status(200).json(cohort);
    })
    .catch(err => next(createError(500, 'Failed to delete cohort')));
});

module.exports = router;