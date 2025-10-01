const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const cors = require('cors'); // Import cors

require('./db.js');

const server = express();

server.name = 'API';

// Define a whitelist of allowed origins. 
// We'll use an environment variable for production and a default for development.
const whitelist = (process.env.CORS_ORIGIN_WHITELIST || 'http://localhost:3000').split(',');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(cors(corsOptions)); // Use cors with our custom options

server.use('/api', routes);

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  // Don't leak stack trace in production
  const message = process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message || err;
  console.error(err);
  // Also, don't send the error object itself in production
  res.status(status).send(process.env.NODE_ENV === 'production' ? { message } : message);
});

module.exports = server;
