
const path = require('path');
const cors = require('cors');
const express = require('express');
const errorHandler = require('errorhandler');

const rootDir = path.join(__dirname, '..');
const adminRouter = require(path.join(rootDir, 'app/routes/admin'));
const formsRouter = require(path.join(rootDir, 'app/routes/forms'));
const rootRouter = require(path.join(rootDir, 'app/routes/root'));
const config = require(path.join(rootDir, 'app/lib/config'));

// Setup server
const app = express();

// Configure server
app.set('view engine', 'pug');
app.set('views', path.join(rootDir, 'app/views'));
app.use(cors({origin: config.corsHeader }));
app.use(express.static(path.join(rootDir, '/public')));

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
} else if (process.env.NODE_ENV === 'production') {
  app.use(errorHandler());
}

// Attach routes
app.use('/', rootRouter);
app.use('/', formsRouter);

if (config.adminUsername && config.adminPassword) {
    app.use('/admin', adminRouter);
}

// Module
module.exports = app;

