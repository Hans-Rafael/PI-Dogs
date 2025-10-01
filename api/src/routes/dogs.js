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
    // If it's a UUID, it's a dog from our DB
    if (isUuid(id)) {
      const dogFromDb = await Dog.findByPk(id, { include: Temperament });
      
      if (dogFromDb) {
        // Standardize the DB dog object to match the API's format
        const formattedDog = {
          id: dogFromDb.id,
          name: dogFromDb.name,
          img: dogFromDb.img,
          temperament: dogFromDb.temperaments.map(t => t.name).join(', '), // Convert array to string
          height: `${dogFromDb.minHeight} - ${dogFromDb.maxHeight}`,
          weight: `${dogFromDb.minWeight} - ${dogFromDb.maxWeight}`,
          life_span: `${dogFromDb.minLifeExp} - ${dogFromDb.maxLifeExp} years`,
          createdInDB: true
        };
        return res.json(formattedDog);
      }
      return res.status(404).json({ message: 'Dog not found in database' });
    }

    // Otherwise, fetch from the external API
    const dogFromApi = await getDogsById(id);
    if (dogFromApi) {
      return res.json(dogFromApi);
    }
    
    return res.status(404).json({ message: 'Dog not found' });

  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, img, temperament, minHeight, maxHeight, minWeight, maxWeight, minLifeExp, maxLifeExp } = req.body;

  // Enhanced validation
  if (!name || !temperament || temperament.length === 0 || !minWeight || !maxWeight || !minHeight || !maxHeight) {
    return res.status(400).json({ message: 'Name, height, weight, and at least one temperament are required.' });
  }

  try {
    const [newDog, created] = await Dog.findOrCreate({
      where: { name }, // Prevent duplicate names
      defaults: {
        img: img || null, // Allow for optional image
        minHeight,
        maxHeight,
        minWeight,
        maxWeight,
        minLifeExp,
        maxLifeExp
      }
    });

    if (!created) {
      return res.status(409).json({ message: 'A dog with this name already exists.' });
    }

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
      return res.status(400).json({ message: 'Invalid ID. Only dogs created in the database can be deleted.' });
    }
    
    const rowsDeleted = await Dog.destroy({
      where: { id }
    });

    if (rowsDeleted > 0) {
      return res.status(204).send(); // Standard success, no content
    }
    
    return res.status(404).json({ message: 'Dog not found in database' });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
