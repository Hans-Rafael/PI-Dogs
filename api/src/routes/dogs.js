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

    // 1. Build the creation object, making the image truly optional.
    const dogPayload = {
      name,
      minHeight,
      maxHeight,
      minWeight,
      maxWeight,
      minLifeExp,
      maxLifeExp,
    };

    // Only add the img field if it's a non-empty string. Otherwise, let the DB default kick in.
    if (img && img.trim() !== '') {
      dogPayload.img = img;
    }

    const newDog = await Dog.create(dogPayload);

    // 2. Correctly find and associate temperaments by name.
    if (temperament && temperament.length > 0) {
        // Step 1: Find the full temperament instances from the DB based on the names array.
        const temperamentInstances = await Temperament.findAll({
            where: { name: temperament }
        });

        // Step 2: Associate the found instances with the new dog.
        // The `addTemperaments` method accepts an array of model instances.
        if (temperamentInstances.length > 0) {
            await newDog.addTemperaments(temperamentInstances);
        }
    }
    
    res.status(201).send({ message: 'Dog created successfully' });

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    // For any other error (like the DB type mismatch), pass it to the default error handler.
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
