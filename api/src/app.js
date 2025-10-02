const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const cors = require('cors');

require('./db.js');

const server = express();

server.name = 'API';

// FIX: Simplify CORS for development, while keeping production secure.
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction 
    ? (process.env.CORS_ORIGIN_WHITELIST || 'http://localhost:3000').split(',')
    : '*'; // Allow any origin in development

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // This is often needed for cookies, auth headers, etc.
};

// Apply middleware
server.use(cors(corsOptions)); // Use the flexible CORS options
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));

// API routes
server.use('/api', routes);

// Error catching endware.
server.use((err, req, res, next) => { 
  const status = err.status || 500;
  const message = isProduction ? 'An unexpected error occurred' : err.message || err;
  console.error(err);
  res.status(status).send({ message });
});

module.exports = server;
