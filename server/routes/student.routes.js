const router = require('express').Router();
const mongoose = require("mongoose");
const Student = require('../models/student.model.js');
const createError = require('http-errors');

router.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find({}).populate("cohort");
    res.status(200).json(students);
  } catch (err) {
    next(createError(500, 'Failed to retrieve students'));
  }
});

router.get('/api/students/:studentId', async (req, res, next) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById(studentId).populate("cohort");
    if (!student) return next(createError(404, 'Student not found'));
    res.status(200).json(student);
  } catch (err) {
    next(createError(500, 'Failed to fetch student'));
  }
});

router.get('/api/students/cohort/:cohortId', async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const students = await Student.find({ cohort: cohortId }).populate("cohort");
    if (!students || students.length === 0) {
      return next(createError(404, 'No students found for this cohort'));
    }
    res.status(200).json(students);
  } catch (err) {
    next(createError(500, 'Failed to fetch students by cohort'));
  }
});

router.post('/api/students', async (req, res, next) => {
  try {
    const createdStudent = await Student.create(req.body);
    res.status(201).json(createdStudent);
  } catch (err) {
    next(createError(500, 'Failed to create the student'));
  }
});

router.put('/api/students/:studentId', async (req, res, next) => {
  const { studentId } = req.params;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, { new: true });
    if (!updatedStudent) return next(createError(404, 'Student not found'));
    res.status(200).json(updatedStudent);
  } catch (err) {
    next(createError(500, 'Failed to update student'));
  }
});

router.delete('/api/students/:studentId', async (req, res, next) => {
  const { studentId } = req.params;
  try {
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) return next(createError(404, 'Student not found'));
    res.status(200).json(deletedStudent);
  } catch (err) {
    next(createError(500, 'Failed to delete student'));
  }
});

module.exports = router;