const router = require("express").Router();

const Cook = require("../models/Cook.model");


//
// POST /cooks
//
/* router.post("/cooks", function (req, res, next) {
    const newCook = req.body;

    Cook.create(newCook)
        .then((cookFromDB) => {
            res.status(201).json(cookFromDB)
        })
        .catch(error => {
            console.log("Error creating a new cook in the DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to create a new cook" });
        });
}) */

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