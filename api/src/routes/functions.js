const axios = require('axios');
const { Dog, Temperament } = require('../db.js');
const { API_KEY } = process.env;
const { Op } = require('sequelize');

const DEFAULT_IMAGE_URL = 'https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_960_720.jpg';

const isUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const getApiInfo = async () => {
  const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds', {
    headers: { 'x-api-key': API_KEY },
  });
  
  return apiUrl.data.map((el) => ({
    id: el.id,
    name: el.name,
    img: el.image ? el.image.url : DEFAULT_IMAGE_URL,
    temperament: el.temperament || 'N/A',
    weight: el.weight.metric,
    height: el.height.metric,
    life_span: el.life_span,
  }));
};

const getDbInfo = async () => {
  const dbDogs = await Dog.findAll({
    include: {
      model: Temperament,
      attributes: ['name'],
      through: { attributes: [] },
    },
  });

  return dbDogs.map((dog) => ({
    id: dog.id,
    name: dog.name,
    img: dog.img || DEFAULT_IMAGE_URL,
    temperament: (dog.Temperaments || []).map((t) => t.name).join(', ') || 'N/A',
    weight: `${dog.minWeight} - ${dog.maxWeight}`,
    height: `${dog.minHeight} - ${dog.maxHeight}`,
    life_span: `${dog.minLifeExp} - ${dog.maxLifeExp} years`,
    createdInDB: dog.createdInDB,
  }));
};

const getAllDogs = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  return [...apiInfo, ...dbInfo];
};

const getDogsById = async (id) => {
  if (isUUID(id)) {
    // DB DOG: Find it and format it directly.
    const dogFromDb = await Dog.findByPk(id, {
      include: {
        model: Temperament,
        attributes: ['name'],
        through: { attributes: [] },
      },
    });
    if (!dogFromDb) throw new Error(`Dog with ID ${id} not found.`);

    return {
      id: dogFromDb.id,
      name: dogFromDb.name,
      img: dogFromDb.img || DEFAULT_IMAGE_URL,
      temperament: (dogFromDb.Temperaments || []).map(t => t.name).join(', ') || 'N/A',
      weight: `${dogFromDb.minWeight} - ${dogFromDb.maxWeight}`,
      height: `${dogFromDb.minHeight} - ${dogFromDb.maxHeight}`,
      life_span: `${dogFromDb.minLifeExp} - ${dogFromDb.maxLifeExp} years`,
      createdInDB: dogFromDb.createdInDB,
    };

  } else {
    // API DOG: Find it and format it directly.
    const allApiDogs = await getApiInfo();
    const dogFromApi = allApiDogs.find(d => d.id == id);
    if (!dogFromApi) throw new Error(`Dog with ID ${id} not found.`);
    
    return {
        id: dogFromApi.id,
        name: dogFromApi.name,
        img: dogFromApi.img,
        temperament: dogFromApi.temperament,
        weight: dogFromApi.weight,
        height: dogFromApi.height,
        life_span: dogFromApi.life_span
    };
  }
};

const getTemperaments = async () => {
  const { count } = await Temperament.findAndCountAll();
  if (count === 0) {
    const response = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`);
    const allTemperaments = new Set();
    response.data.forEach(breed => {
      if (breed.temperament) {
        breed.temperament.split(',').forEach(temp => {
          const trimmedTemp = temp.trim();
          if (trimmedTemp) allTemperaments.add(trimmedTemp);
        });
      }
    });
    const temperamentObjects = Array.from(allTemperaments).map(name => ({ name }));
    await Temperament.bulkCreate(temperamentObjects, { ignoreDuplicates: true });
  }
  return await Temperament.findAll({ order: [['name', 'ASC']] });
};

module.exports = {
  getAllDogs,
  getDogsById,
  getTemperaments,
};
