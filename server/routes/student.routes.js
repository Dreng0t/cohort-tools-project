const router = require('express').Router();

const mongoose = require("mongoose");

const Student = require('../models/student.model.js')

router.get("/students", (req, res, next) => {
  Student.find({})
    .populate("cohort")
    .then(students => res.status(200).json(students))
    .catch(err => next(createError(500, 'Failed to retrieve students')));
});

router.get('/students/:studentId', (req, res, next) => {
  let { studentId } = req.params;
  Student.findById(studentId)
    .populate("cohort")
    .then(student => {
      res.status(200).json(student);
    })
    .catch(err => next(createError(500, 'Failed to fetch student')));
});

router.get('/students/cohort/:cohortId', (req, res, next) => {
  let { cohortId } = req.params;
  let filter = {cohort: cohortId}
  Student.find(filter)
    .populate("cohort")
    .then(students => {
      if (!students) return next(createError(404, 'Student not found'));
      res.status(200).json(students);
    })
    .catch(err => next(createError(500, 'Failed to fetch student')));
});

router.post('/students', (req, res, next) => {
  Student.create(req.body)
    .then(createdStudent => res.status(201).json(createdStudent))
    .catch(err => next(createError(500, 'Failed to create the student')));
});

router.put('/students/:studentId', (req, res, next) => {
  let { studentId } = req.params;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then(student => {
      if (!student) return next(createError(404, 'Student not found'));
      res.status(200).json(student);
    })
    .catch(err => next(createError(500, 'Failed to update student')));
});

router.delete('/students/:studentId', (req, res, next) => {
  let { studentId } = req.params;
  Student.findByIdAndDelete(studentId)
    .then(student => {
      if (!student) return next(createError(404, 'Student not found'));
      res.status(200).json(student);
    })
    .catch(err => next(createError(500, 'Failed to delete student')));
});

module.exports = router;