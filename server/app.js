const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const Cohort = require('./models/cohort.model')
const Student = require('./models/student.model')
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohorts = require("./cohorts.json");
const students = require("./students.json");


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    origin: ['http://localhost:5173'] // Add the URLs of allowed origins to this array
  })
);

mongoose

  .connect('mongodb://127.0.0.1:27017/cohort-tools-DB')

  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))

  .catch(err => console.error('Error connecting to mongo', err));

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/", (req, res) => {
  res.json({ number: Math.floor(Math.random() * 101) });
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res) => {
  res.json(cohorts)
});

app.get("/api/students", (req, res) => {
  res.json(students)
});

app.get("/students", (req, res) => {
  Student.find({})
    .then(students => {
      res.status(200).json(students);
    })
    .catch(error => {

      console.error('Error while retrieving students ->', error);

      res.status(500).json({ error: 'Failed to retrieve students' });

    });
})

app.post('/cohorts', (req, res) => {

  // req.body contains the data sent by the client.

  // This must match the structure defined in our Book schema.

 

  // Book.create(req.body)

  // // OR

  Cohort.create({

    cohortSlug: req.body.cohortSlug,

    cohortName: req.body.cohortName,

    program : req.body.program,

    format: req.body.format,

    campus: req.body.campus,

    startDate: req.body.startDate,

    endDate: req.body.endDate,

    inProgress: req.body.inProgress,

    programManager: req.body.programManager,

    leadTeacher: req.body.leadTeacher,

    totalHours: req.body.totalHours

  })

    .then(createdStudent => {

      console.log('Book created ->', createdStudent);

      res.status(201).json(createdStudent);

    })

    .catch(error => {

      console.error('Error while creating the cohort ->', error);

      res.status(500).json({ error: 'Failed to create the cohort' });

    });

});

app.post('/students', (req, res) => {
Student.create({

    firstName: req.body.firstName,

    lastName: req.body.lastName,

    email : req.body.email,

    phone: req.body.phone,

    linkedinUrl: req.body.linkedinUrl,

    languages: req.body.languages,

    program: req.body.program,

    background: req.body.background,

    image: req.body.image,

    cohort: req.body.cohort,

    projects: req.body.projects

  })

    .then(createdStudent => {

      console.log('Book created ->', createdStudent);

      res.status(201).json(createdStudent);

    })

    .catch(error => {

      console.error('Error while creating the student ->', error);

      res.status(500).json({ error: 'Failed to create the student' });

    });

});

// START SERVER
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;

