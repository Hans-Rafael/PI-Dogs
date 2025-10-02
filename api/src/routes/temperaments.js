const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { Temperament } = require('../db.js');
const { API_KEY } = process.env;

router.get('/', async (req, res, next) => {
    try {
        // Use findAndCountAll to check if the table is empty efficiently.
        const { count } = await Temperament.findAndCountAll();

        // If DB is empty, fetch from API and populate it.
        if (count === 0) {
            console.log('Temperament table is empty, seeding from API...');
            const response = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`);
            const allTemperaments = new Set();

            response.data.forEach(breed => {
                if (breed.temperament) {
                    breed.temperament.split(',').forEach(temp => {
                        const trimmedTemp = temp.trim();
                        if (trimmedTemp) {
                            allTemperaments.add(trimmedTemp);
                        }
                    });
                }
            });

            const temperamentObjects = Array.from(allTemperaments).map(name => ({ name }));
            
            // Use bulkCreate for efficient seeding.
            await Temperament.bulkCreate(temperamentObjects, { ignoreDuplicates: true });
            console.log(`Seeded ${temperamentObjects.length} temperaments.`);
        }

        // SENIOR DEV FIX: Always return the full temperament objects {id, name}.
        // The frontend form depends on this structure to render the select options.
        const temperamentsFromDb = await Temperament.findAll({
            order: [
                ['name', req.query.order || 'ASC']
            ]
        });

        res.status(200).json(temperamentsFromDb);

    } catch (error) {
        // Pass any errors to the central error handler.
        next(error);
    }
});

module.exports = router;
