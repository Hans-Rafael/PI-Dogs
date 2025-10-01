const { Router } = require('express');
const { Temperament } = require('../db');
const { getTemperaments } = require('./functions');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const temperaments = await Temperament.findAll();
    if (temperaments.length === 0) {
      const apiTemperaments = await getTemperaments();
      const temperamentNames = apiTemperaments.map(t => ({ name: t.toLowerCase() }));
      await Temperament.bulkCreate(temperamentNames);
      const allTemperaments = await Temperament.findAll();
      return res.json(allTemperaments);
    }
    return res.json(temperaments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
