const { Router } = require('express');
const dogsRouter = require('./dogs');
const temperamentsRouter = require('./temperaments');

const router = Router();

router.use('/dogs', dogsRouter);
router.use('/temperaments', temperamentsRouter);

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

module.exports = router;
