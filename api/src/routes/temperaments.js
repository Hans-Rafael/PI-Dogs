const { Router } = require('express');
const { Temperament, sequelize } = require('../db');
const { getTemperaments } = require('./functions');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    // Allow the client to specify the order (ASC or DESC)
    const { order = 'ASC' } = req.query;
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const queryOptions = { order: [[ 'name', sortOrder ]] };

    const temperaments = await Temperament.findAll(queryOptions);
    if (temperaments.length > 0) {
      return res.json(temperaments);
    }

    // Use a transaction to prevent race conditions
    const result = await sequelize.transaction(async (t) => {
      const transactionQueryOptions = { ...queryOptions, transaction: t };
      const temperamentsInDb = await Temperament.findAll(transactionQueryOptions);
      if (temperamentsInDb.length > 0) {
        return temperamentsInDb;
      }

      const apiTemperaments = await getTemperaments();
      const temperamentNames = apiTemperaments.map(temp => ({ name: temp.toLowerCase() }));
      
      await Temperament.bulkCreate(temperamentNames, { transaction: t, ignoreDuplicates: true });
      
      return await Temperament.findAll(transactionQueryOptions);
    });

    return res.json(result);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
