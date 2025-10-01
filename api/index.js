const server = require('./src/app.js');
const { conn, closeConnection } = require('./src/db.js');
const port = process.env.PORT || 3001;

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
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
