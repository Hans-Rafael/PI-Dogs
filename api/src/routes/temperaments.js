const { Router } = require('express');
const { Temperament, sequelize } = require('../db');
const { getTemperaments } = require('./functions');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const temperaments = await Temperament.findAll();
    if (temperaments.length > 0) {
      return res.json(temperaments);
    }

    // Use a transaction to prevent race conditions
    const result = await sequelize.transaction(async (t) => {
      const temperamentsInDb = await Temperament.findAll({ transaction: t });
      if (temperamentsInDb.length > 0) {
        return temperamentsInDb;
      }

      const apiTemperaments = await getTemperaments();
      const temperamentNames = apiTemperaments.map(temp => ({ name: temp.toLowerCase() }));
      
      await Temperament.bulkCreate(temperamentNames, { transaction: t });
      
      return await Temperament.findAll({ transaction: t });
    });

    return res.json(result);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
