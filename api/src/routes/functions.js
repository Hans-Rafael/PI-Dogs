const axios = require('axios');
const { Dog, Temperament } = require('../db.js');
const { API_KEY } = process.env;
const { Op } = require('sequelize');

const DEFAULT_IMAGE_URL = 'https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_960_720.jpg';

const isUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// SENIOR DEV FIX: Unify data format at the source.
// Both API and DB functions will now return a `temperament` STRING, not an array.

const getApiInfo = async () => {
  try {
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds', {
      headers: { 'x-api-key': API_KEY },
    });
    
    return apiUrl.data.map((el) => {
      return {
        id: el.id,
        name: el.name,
        img: el.image ? el.image.url : DEFAULT_IMAGE_URL,
        temperament: el.temperament || 'N/A', // Use the string directly
        weight: el.weight.metric,
        height: el.height.metric,
        life_span: el.life_span,
      };
    });
  } catch (error) {
    console.error('Error fetching from external API:', error.message);
    throw new Error('Failed to fetch from external API');
  }
};

const getDbInfo = async () => {
  try {
    const dbDogs = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ['name'],
        through: { attributes: [] },
      },
    });

    return dbDogs.map((dog) => {
      // Convert the array of temperament objects into a single comma-separated string.
      const temperamentString = (dog.Temperaments || []).map((t) => t.name).join(', ');
      
      return {
        id: dog.id,
        name: dog.name,
        img: dog.img || DEFAULT_IMAGE_URL,
        temperament: temperamentString || 'N/A', // Use the generated string
        weight: `${dog.minWeight} - ${dog.maxWeight}`,
        height: `${dog.minHeight} - ${dog.maxHeight}`,
        life_span: `${dog.minLifeExp} - ${dog.maxLifeExp} years`,
        createdInDB: dog.createdInDB,
      };
    });
  } catch (error) {
    console.error('Error fetching from DB:', error.message);
    throw new Error('Failed to fetch from DB');
  }
};

const getAllDogs = async () => {
  try {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    return [...apiInfo, ...dbInfo];
  } catch (error) {
    console.error('Error combining data sources:', error.message);
    throw error;
  }
};

const getDogsById = async (id) => {
    // Helper to format dog details consistently.
    const formatDogDetails = (dog, isDbDog = false) => {
        if (!dog) return null;

        let temperament, weight, height, life_span;

        if (isDbDog) {
            temperament = (dog.Temperaments || []).map(t => t.name).join(', ');
            weight = `${dog.minWeight} - ${dog.maxWeight}`;
            height = `${dog.minHeight} - ${dog.maxHeight}`;
            life_span = `${dog.minLifeExp} - ${dog.maxLifeExp} years`;
        } else {
            temperament = dog.temperament || 'N/A';
            weight = dog.weight.metric;
            height = dog.height.metric;
            life_span = dog.life_span;
        }

        return {
            id: dog.id,
            name: dog.name,
            img: (dog.image && dog.image.url) || dog.img || DEFAULT_IMAGE_URL,
            temperament: temperament,
            weight: weight,
            height: height,
            life_span: life_span,
            createdInDB: dog.createdInDB || false,
        };
    };

    if (isUUID(id)) {
        const dogFromDb = await Dog.findByPk(id, {
            include: { model: Temperament, attributes: ['name'], through: { attributes: [] } },
        });
        if (!dogFromDb) throw new Error(`Dog with ID ${id} not found.`);
        return formatDogDetails(dogFromDb, true);
    } else {
        const response = await axios.get('https://api.thedogapi.com/v1/breeds', { headers: { 'x-api-key': API_KEY } });
        const dogFromApi = response.data.find(d => d.id == id);
        if (!dogFromApi) throw new Error(`Dog with ID ${id} not found.`);
        return formatDogDetails(dogFromApi);
    }
};

const getTemperaments = async () => {
  // This function remains the same, as the creation form still needs the full objects.
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
