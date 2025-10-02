const { Router } = require('express');
const router = Router();
const { getAllDogs, getDogsById } = require('./functions');
const { Dog, Temperament } = require('../db');
const { Op } = require('sequelize');

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
    console.log('Received temperament:', temperament);

    const dogPayload = {
      name,
      minHeight,
      maxHeight,
      minWeight,
      maxWeight,
      minLifeExp,
      maxLifeExp,
    };

    if (img && img.trim() !== '') {
      dogPayload.img = img;
    }

    const newDog = await Dog.create(dogPayload);

    // Find the IDs of the temperaments and use `setTemperaments` for a clean, atomic association.
    if (temperament && temperament.length > 0) {
        const temperamentInstances = await Temperament.findAll({
            where: { name: { [Op.in]: temperament } },
            attributes: ['id'] // Only fetch the ID.
        });

        console.log('Found temperament instances:', temperamentInstances.length);
        if (temperamentInstances.length > 0) {
            const temperamentIds = temperamentInstances.map(inst => inst.id);
            console.log('Setting temperament IDs:', temperamentIds);
            await newDog.setTemperaments(temperamentIds); // setTemperaments uses an array of primary keys.
        }
    }
    
    // To ensure the client gets the full new dog data, we refetch it.
    const finalNewDog = await getDogsById(newDog.id);

    res.status(201).json(finalNewDog);

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
