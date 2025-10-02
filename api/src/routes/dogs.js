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

// THE DEFINITIVE FIX: Trust the error message. The DB model wants min/max fields directly.
router.post('/', async (req, res, next) => {
  try {
    const { name, minHeight, maxHeight, minWeight, maxWeight, minLifeExp, maxLifeExp, img, temperament } = req.body;

    // Create the dog object passing the fields directly, as the DB model expects them.
    // The error "path: 'minHeight'" was the definitive clue.
    const newDog = await Dog.create({
      name,
      minHeight, // Pass directly
      maxHeight, // Pass directly
      minWeight, // Pass directly
      maxWeight, // Pass directly
      life_span: minLifeExp && maxLifeExp ? `${minLifeExp} - ${maxLifeExp} years` : null, // Combine life span into a string
      image: img,     // Map frontend 'img' to backend 'image'
    });

    if (temperament && temperament.length > 0) {
        const foundTemperaments = await Temperament.findAll({ where: { name: temperament } });
        await newDog.addTemperament(foundTemperaments);
    }
    
    res.status(201).send(newDog);
  } catch (error) {
    // Any validation error from the DB will be caught and sent to the frontend's new catch block.
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
