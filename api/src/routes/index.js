const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {getDogs, getById,createDog,delateDog,test} = require('./dogs.js');
const {getTemper} = require('./temperaments.js');
const {configRoutes} = require('./routes.js');

const router = Router();

// Configurar los routers;
// Ejemplo: router.use('/auth', authRouter);
//router.send('/dogs',( req,res)=>{res.send("hellow world \n")});

router.get('/dogs', getDogs);
router.get('/dogs/:id', getById);
router.post('/dogs', createDog);
router.delete('/dogs/:id', delateDog);
router.get('/temperaments', getTemper);

module.exports = router;
