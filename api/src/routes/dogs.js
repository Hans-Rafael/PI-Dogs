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

// FIX: Correctly handle form data from the frontend
router.post('/', async (req, res, next) => {
  try {
    // Destructure using frontend names (minHeight, img, temperament)
    const { name, minHeight, maxHeight, minWeight, maxWeight, minLifeExp, maxLifeExp, img, temperament } = req.body;

    const newDog = await Dog.create({
      name,
      minHeight,      // Pass correctly to the model
      maxHeight,      // Pass correctly to the model
      minWeight,      // Pass correctly to the model
      maxWeight,      // Pass correctly to the model
      minLifeExp,     // Pass correctly to the model
      maxLifeExp,     // Pass correctly to the model
      image: img,     // Map frontend 'img' to backend 'image'
    });

    // Handle temperaments (frontend sends 'temperament', plural)
    if (temperament && temperament.length > 0) {
        const foundTemperaments = await Temperament.findAll({ where: { name: temperament } });
        await newDog.addTemperament(foundTemperaments);
    }
    
    res.status(201).send(newDog);
  } catch (error) {
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
