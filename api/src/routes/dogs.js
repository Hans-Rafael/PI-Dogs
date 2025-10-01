const { Router } = require('express');
const { Dog, Temperament } = require('../db');
const { getAllDogs, getDogsById } = require('./functions');
const { validate: isUuid } = require('uuid');

const router = Router();

router.get('/', async (req, res, next) => {
  const { name } = req.query;
  try {
    const dogs = await getAllDogs();
    if (name) {
      const filteredDogs = dogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()));
      if (filteredDogs.length > 0) {
        return res.json(filteredDogs);
      } 
      return res.status(404).json({ message: 'No dogs found with that name' });
    }
    return res.json(dogs);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (isUuid(id)) {
      const dog = await Dog.findByPk(id, { include: Temperament });
      if (dog) {
        return res.json(dog);
      }
      return res.status(404).json({ message: 'No dog found with that ID' });
    }
    const dog = await getDogsById(id);
    if (dog) {
      return res.json(dog);
    }
    return res.status(404).json({ message: 'No dog found with that ID' });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, img, temperament, minHeight, maxHeight, minWeight, maxWeight, minLifeExp, maxLifeExp } = req.body;

  if (!name || !temperament || !minWeight || !maxWeight || !minHeight || !maxHeight) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newDog = await Dog.create({
      name,
      img,
      minHeight,
      maxHeight,
      minWeight,
      maxWeight,
      minLifeExp,
      maxLifeExp
    });

    const associatedTemperaments = await Temperament.findAll({
      where: {
        name: temperament
      }
    });

    await newDog.addTemperament(associatedTemperaments);

    return res.status(201).json(newDog);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!isUuid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const deletedDog = await Dog.destroy({
      where: { id }
    });
    if (deletedDog) {
      return res.status(204).send(); // No content
    }
    return res.status(404).json({ message: 'No dog found with that ID' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
