const { Router } = require('express');
const router = Router();
const { getAllDogs, getDogsById } = require('./functions');
const { Dog, Temperament } = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const { name } = req.query;
    const allDogs = await getAllDogs();
    if (name) {
      const dogsByName = allDogs.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
      if (dogsByName.length) {
        return res.status(200).send(dogsByName);
      }
      return res.status(404).json({ message: 'Sorry, we can\'t find the dog you are looking for' });
    }
    return res.status(200).send(allDogs);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const dog = await getDogsById(id);
    res.status(200).json(dog);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, minHeight, maxHeight, minWeight, maxWeight, minLifeExp, maxLifeExp, img, temperament } = req.body;

    const newDog = await Dog.create({
      name,
      minHeight,
      maxHeight,
      minWeight,
      maxWeight,
      minLifeExp,
      maxLifeExp,
      img,
    });

    // SENIOR FIX: The form sends an array of temperament IDs, not names.
    // The `addTemperament` method is smart enough to accept an array of primary keys directly.
    // This is more efficient and respects the data contract.
    if (temperament && temperament.length > 0) {
        await newDog.addTemperament(temperament);
    }
    
    res.status(201).send({ message: 'Dog created successfully' });

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const dogToDelete = await Dog.findByPk(id);
        if (dogToDelete) {
            await dogToDelete.destroy();
            res.status(200).send({ message: 'Dog deleted successfully' });
        } else {
            res.status(404).send({ message: 'Dog not found' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
