const axios = require('axios');
const api = 'https://api.thedogapi.com/v1/breeds';
const { Dog, Temperament } = require('../db');


//  APIDOGS

const getApiDogs = async () => {
    const response = await axios(`${api}`);
    const inf = response.data.map(e => ({
        id: e.id,
        name: (e.name).toLowerCase(),
        img: e.image.url,
        temperament: (e.temperament)?.toLowerCase(),
        weight: e.weight.metric,
        height: e.height.metric,
        lifeExp: e.life_span,
        createdInDB: false
    }))
    //console.log(inf)
    return inf
    
}
//getApiDogs()
//  dbDOGS 
const getDBDogs = async () => {
    const dbDogs = await Dog.findAll({ 
        include: Temperament,
    })
    return dbDogs.map(e => {
        return {
            id: e.id,
            name: e.name,
            img: e.img,
            temperament: e.temperaments.map(e=>e.name).join(', '),
            weight: `${e.minWeight} - ${e.maxWeight}`,
            height: `${e.minHeight} - ${e.maxHeight}`,
            lifeExp: `${e.minLifeExp} - ${e.maxLifeExp}`,
            createdInDB: true
        }
    })
}


// All Dogs 
const getAllDogs = async () => {
    const apiDogs = await getApiDogs();
    const dbDogs = await getDBDogs();
    const allDogs = [...apiDogs, ...dbDogs]
    // return apiDogs;
    //return dbDogs
    return allDogs;
}

//get dog By id
const getDogsById = async (id) => {
    const Dogs = await getAllDogs();
    const dog = Dogs.map((e) => e);
    const filter = dog.filter((e) => e.id == id);
    return filter;
}
// All Temperaments
const getTemperaments = async () => {
    const apiInfo = await getApiDogs();
    const temperaments = apiInfo.map((e) => e.temperament).join(', ');
    const temperaments2 = temperaments.split(', ')
    const temper = new Set(temperaments2)
    const result = [...temper].filter(Boolean)// para eliminar el undefined filter (Boolean)
    //console.log(result.map(e => e.charAt(0).toUpperCase() + e.slice(1)))
    //console.log (result)
    //console.log(result.map(e => e.toLowerCase()))
    return result
}
//getTemperaments()

module.exports = {
    getAllDogs,
    getTemperaments,
    getDogsById,
    
}
