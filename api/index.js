const server = require('./src/app.js');
const { conn, closeConnection } = require('./src/db.js');
const port = process.env.PORT || 3001;

// Syncing all the models at once.
// force: false will create tables if they do not exist, but will not drop them, preserving your data.
conn.sync({ force: false }).then(() => {
  // Bind to 0.0.0.0 to make the service accessible from outside the container.
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to sync database and start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, closing server and database connections...');
  await closeConnection();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
