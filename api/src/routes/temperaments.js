const { Router } = require('express');
const { Temperament, sequelize } = require('../db');
const { getTemperaments } = require('./functions');

const router = Router();

// Helper to capitalize the first letter of a string
const capitalize = (s) => {
  if (typeof s !== 'string' || s.length === 0) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

router.get('/', async (req, res, next) => {
  try {
    // Allow the client to specify the order (ASC or DESC)
    const { order = 'ASC' } = req.query;
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const queryOptions = { order: [[ 'name', sortOrder ]] };

    // First, try to find temperaments in our DB
    const temperaments = await Temperament.findAll(queryOptions);
    if (temperaments.length > 0) {
      return res.json(temperaments);
    }

    // If DB is empty, fetch from API, process, and store
    // Use a transaction to ensure data integrity
    const result = await sequelize.transaction(async (t) => {

      // Double-check inside the transaction to prevent race conditions
      const temperamentsInDb = await Temperament.findAll({ transaction: t });
      if (temperamentsInDb.length > 0) {
        // If another process populated the DB while we waited, sort and return them
        return await Temperament.findAll({ ...queryOptions, transaction: t });
      }

      // Fetch from the external source
      const apiTemperaments = await getTemperaments();
      
      // Process the names: Capitalize them and prepare for DB insertion
      const temperamentNames = apiTemperaments.map(temp => ({ name: capitalize(temp) }));
      
      // Save the processed temperaments into the database
      await Temperament.bulkCreate(temperamentNames, { transaction: t, ignoreDuplicates: true });
      
      // Fetch the newly created temperaments with the correct order
      return await Temperament.findAll({ ...queryOptions, transaction: t });
    });

    return res.json(result);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
