const axios = require('axios');
const { Dog, Temperament } = require('../db.js');
const { API_KEY } = process.env;
const { Op } = require('sequelize');

const DEFAULT_IMAGE_URL = 'https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_960_720.jpg';

// Helper to check if an ID is a UUID (from the database)
const isUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Normalizes data from the external API
const getApiInfo = async () => {
  try {
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds', {
      headers: { 'x-api-key': API_KEY },
    });
    
    return apiUrl.data.map((el) => {
      const temperamentsArray = el.temperament ? el.temperament.split(',').map(t => t.trim()) : [];

      return {
        id: el.id,
        name: el.name,
        img: el.image ? el.image.url : DEFAULT_IMAGE_URL,
        temperaments: temperamentsArray,
        weight: el.weight.metric,
        height: el.height.metric,
        life_span: el.life_span,
      };
    });
  } catch (error) {
    console.error('Error fetching data from the external API:', error.message);
    throw new Error('Failed to fetch data from the external API');
  }
};

// Normalizes data from the local database
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
      const temperamentsArray = (dog.Temperaments || []).map((t) => t.name);
      
      return {
        id: dog.id,
        name: dog.name,
        img: dog.img || DEFAULT_IMAGE_URL,
        temperaments: temperamentsArray,
        weight: `${dog.minWeight} - ${dog.maxWeight}`,
        height: `${dog.minHeight} - ${dog.maxHeight}`,
        life_span: `${dog.minLifeExp} - ${dog.maxLifeExp} years`,
        createdInDB: dog.createdInDB,
      };
    });
  } catch (error) {
    console.error('Error processing data from the local database:', error.message);
    throw new Error('Failed to process data from the database');
  }
};

// Combines data from both sources
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

// SENIOR DEV FIX: Refactored to handle DB and API dogs separately for clarity and correctness.
const getDogsById = async (id) => {
  if (isUUID(id)) {
    // It's a dog from our database, fetch it directly with its temperaments.
    const dog = await Dog.findByPk(id, {
      include: {
        model: Temperament,
        attributes: ['name'],
        through: { attributes: [] },
      },
    });

    if (!dog) {
      throw new Error(`Dog with ID ${id} not found in database.`);
    }

    // Manually format the response to match the unified structure perfectly.
    const temperamentsArray = (dog.Temperaments || []).map((t) => t.name);
    return {
      id: dog.id,
      name: dog.name,
      img: dog.img || DEFAULT_IMAGE_URL,
      temperaments: temperamentsArray,
      weight: `${dog.minWeight} - ${dog.maxWeight}`,
      height: `${dog.minHeight} - ${dog.maxHeight}`,
      life_span: `${dog.minLifeExp} - ${dog.maxLifeExp} years`,
      createdInDB: dog.createdInDB,
    };

  } else {
    // It's a dog from the API. Fetch all and find it.
    const allApiDogs = await getApiInfo();
    const dog = allApiDogs.find(d => d.id == id);
    if (!dog) {
      throw new Error(`Dog with ID ${id} not found in API.`);
    }
    return dog;
  }
};

const getTemperaments = async () => {
  try {
    const apiInfo = await getApiInfo();
    const allTemperaments = apiInfo.flatMap(dog => dog.temperaments);
    const uniqueTemperaments = [...new Set(allTemperaments)].filter(Boolean);
    return uniqueTemperaments.sort();
  } catch (error) {
    console.error('Error fetching or processing temperaments:', error.message);
    throw new Error('Failed to get temperaments');
  }
};

module.exports = {
  getAllDogs,
  getDogsById,
  getTemperaments,
};
