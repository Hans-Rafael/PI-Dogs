const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {getDogs, getById,createDog,delateDog} = require('./dogs.js');
const {getTemper} = require('./temperaments.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get('/dogs', getDogs);
router.get('/dogs/:id', getById);
router.post('/dogs', createDog);
router.delete('/dogs/:id', delateDog);
router.get('/temperaments', getTemper);

module.exports = router;
