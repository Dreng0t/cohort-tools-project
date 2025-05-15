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
const createError = require('http-errors');
const Cohort = require('./models/cohort.model')

const PORT = 5005;

const cohorts = require("./cohorts.json");
const students = require("./students.json");

const app = express();

app.disable('x-powered-by')

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get('/form', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(
  cors({
    origin: ['http://localhost:5173'],
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

app.get("/", (req, res) => {
  res.json({ number: Math.floor(Math.random() * 101) });
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.use("/", require("./routes/cohort.routes"))
app.use("/", require("./routes/student.routes"))

app.use((req, res, next) => {
  next(createError(404, "Sorry, can't find that!"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Something broke!' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}


module.exports = app;