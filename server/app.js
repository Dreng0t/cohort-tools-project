const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
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

//
// Security
//
app.disable('x-powered-by')

app.use(cookieParser()); // Needed to store CSRF token in cookies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // For JSON bodies

const csrfProtection = csrf({ cookie: true }); // Store token in cookie
app.use(csrfProtection);

app.get('/form', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use(helmet());
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss());           // Prevent XSS

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

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

/*
app.get("/api/cohorts", (req, res) => {
  res.json(cohorts)
});*/

/*app.get("/api/students", (req, res) => {
  res.json(students)
});*/

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then(cohorts => {
      res.status(200).json(cohorts);
    })
    .catch(error => {

      console.error('Error while retrieving cohorts ->', error);

      res.status(500).json({ error: 'Failed to retrieve cohorts' });

    });
})

app.get('/api/cohorts/:cohortId', (req, res, next) => {

  let { cohortId } = req.params;

  Cohort.findById(cohortId)
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((error) => {
      console.log("\n\n Error fetching cohort in the DB...\n", error);
      res.status(500).json({ error: 'Failed to fetch cohort' });
    })
})

app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then(students => {
      res.status(200).json(students);
    })
    .catch(error => {

      console.error('Error while retrieving students ->', error);

      res.status(500).json({ error: 'Failed to retrieve students' });

    });
})

app.get('/api/students/:studentId', (req, res, next) => {

  let { studentId } = req.params;

  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((error) => {
      console.log("\n\n Error fetching student in the DB...\n", error);
      res.status(500).json({ error: 'Failed to fetch student' });
    })
})

app.post('/api/cohorts', (req, res) => {

  // req.body contains the data sent by the client.

  // This must match the structure defined in our Book schema.



  // Book.create(req.body)

  // // OR

  Cohort.create({

    cohortSlug: req.body.cohortSlug,

    cohortName: req.body.cohortName,

    program: req.body.program,

    format: req.body.format,

    campus: req.body.campus,

    startDate: req.body.startDate,

    endDate: req.body.endDate,

    inProgress: req.body.inProgress,

    programManager: req.body.programManager,

    leadTeacher: req.body.leadTeacher,

    totalHours: req.body.totalHours

  })

    .then(createdCohort => {

      console.log('Cohort created ->', createdCohort);

      res.status(201).json(createdCohort);

    })

    .catch(error => {

      console.error('Error while creating the cohort ->', error);

      res.status(500).json({ error: 'Failed to create the cohort' });

    });

});

app.post('/api/students', (req, res) => {
  Student.create({

    firstName: req.body.firstName,

    lastName: req.body.lastName,

    email: req.body.email,

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

      console.log('Student created ->', createdStudent);

      res.status(201).json(createdStudent);

    })

    .catch(error => {

      console.error('Error while creating the student ->', error);

      res.status(500).json({ error: 'Failed to create the student' });

    });

});

app.put('/api/cohorts/:cohortId', (req, res, next) => {

  let { cohortId } = req.params;

  const newcohort = req.body;

  Cohort.findByIdAndUpdate(cohortId, newcohort, { new: true })
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((error) => {
      console.log("\n\n Error updating cohort in the DB...\n", error);
      res.status(500).json({ error: 'Failed to fetch cohort' });
    })
})

app.put('/api/students/:studentId', (req, res, next) => {

  let { studentId } = req.params;

  const newstudent = req.body;

  Student.findByIdAndUpdate(studentId, newstudent, { new: true })
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((error) => {
      console.log("\n\n Error updating student in the DB...\n", error);
      res.status(500).json({ error: 'Failed to fetch student' });
    })
})

app.delete('/cohorts/:cohortId', (req, res, next) => {

  let { cohortId } = req.params;

  Cohort.findByIdAndDelete(cohortId)
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((error) => {
      console.log("\n\n Error deleting cohort in the DB...\n", error);
      res.status(500).json({ error: 'Failed to fetch cohort' });
    })
})

app.delete('/students/:studentId', (req, res, next) => {

  let { studentId } = req.params;

  Student.findByIdAndDelete(studentId)
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((error) => {
      console.log("\n\n Error deleting student in the DB...\n", error);
      res.status(500).json({ error: 'Failed to fetch student' });
    })
})

// START SERVER
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;

