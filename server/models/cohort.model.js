const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 

// CREATE SCHEMA

// Schema - describes and enforces the structure of the documents

const cohortSchema = new Schema({

  cohortSlug: {
    type: String,
    required: true,
    unique: true,
  },

  cohortName: {
    type: String,
    required: true,
    unique: true,
  },

  program : {
    type: String,
    required: true
  },

  format: {
    type: String,
    required: true
  },

  campus: {
    type: String,
    required: true
  },

  startDate: {
    type: Date,
    default: Date.now
  },

  endDate: {
    type: Date,
    default: Date.now
  },

  inProgress: {
    type: Boolean,
    default: false,
  },

  programManager: {
    type: String,
    required: true
  },

  leadTeacher: {
    type: String,
    required: true
  },

  totalHours: {
    type: Number,
    min: 1
  }

});

 

// CREATE MODEL

// The model() method defines a model (Book) and creates a collection (books) in MongoDB

// The collection name will default to the lowercased, plural form of the model name:

//                          "Book" --> "books"

const Cohort = mongoose.model('Cohort', cohortSchema);

 

// EXPORT THE MODEL

module.exports = Cohort;