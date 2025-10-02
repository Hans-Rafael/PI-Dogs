const { Router } = require('express');
const router = Router();
const { getAllDogs, getDogsById } = require('./functions'); // FIX: Import getDogsById
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
    const dog = await getDogsById(id); // This will now work
    res.status(200).json(dog);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, heightMin, heightMax, weightMin, weightMax, life_span, image, temperaments } = req.body;

    const newDog = await Dog.create({
      name,
      heightMin,
      heightMax,
      weightMin,
      weightMax,
      life_span,
      image,
    });

    if (temperaments) {
        const foundTemperaments = await Temperament.findAll({ where: { name: temperaments } });
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
