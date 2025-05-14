const mongoose = require('mongoose');

const Schema = mongoose.Schema;



// CREATE SCHEMA

// Schema - describes and enforces the structure of the documents

const studentSchema = new Schema({

  firstName: String,

  lastName: String,

  email: String,

  phone: String,

  linkedinUrl: String,

  languages: [String],

  program: String,

  backgound: String,

  image: String,

  projects: Array,

  cohort: {
    type: Schema.Types.ObjectId,
    ref: `Cohort`,
    required: true
  }

});



// CREATE MODEL

// The model() method defines a model (Book) and creates a collection (books) in MongoDB

// The collection name will default to the lowercased, plural form of the model name:

//                          "Book" --> "books"

const Student = mongoose.model('student', studentSchema);



// EXPORT THE MODEL

module.exports = Student;