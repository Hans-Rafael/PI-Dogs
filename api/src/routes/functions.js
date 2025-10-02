const axios = require('axios');
const { Dog, Temperament } = require('../db.js');
const { API_KEY } = process.env;

const DEFAULT_IMAGE_URL = 'https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_960_720.jpg';

// Normalizes data from the external API
const getApiInfo = async () => {
  try {
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds', {
      headers: { 'x-api-key': API_KEY },
    });
    
    return apiUrl.data.map((el) => {
      // FIX: The 'temperament' field is now 'temperaments' and is always an array of strings.
      const temperamentsArray = el.temperament ? el.temperament.split(',').map(t => t.trim()) : [];

      return {
        id: el.id,
        name: el.name,
        img: el.image ? el.image.url : DEFAULT_IMAGE_URL,
        temperaments: temperamentsArray, // Corrected field name and format
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
      // FIX: The 'temperaments' field is now an array of strings, not a single string.
      const temperamentsArray = (dog.Temperaments || []).map((t) => t.name);
      
      const weightString = `${dog.minWeight} - ${dog.maxWeight}`;
      const heightString = `${dog.minHeight} - ${dog.maxHeight}`;
      const lifeSpanString = `${dog.minLifeExp} - ${dog.maxLifeExp} years`;

      return {
        id: dog.id,
        name: dog.name,
        img: dog.img || DEFAULT_IMAGE_URL,
        temperaments: temperamentsArray, // Corrected field name and format
        // Presentational strings for list/card views
        weight: weightString,
        height: heightString,
        life_span: lifeSpanString,
        // Raw data for detail views and filtering
        minWeight: dog.minWeight,
        maxWeight: dog.maxWeight,
        minHeight: dog.minHeight,
        maxHeight: dog.maxHeight,
        minLifeExp: dog.minLifeExp,
        maxLifeExp: dog.maxLifeExp,
        createdInDB: dog.createdInDB,
      };
    });
  } catch (error) {
    console.error('Error processing data from the local database:', error.message);
    throw new Error('Failed to process data from the database');
  }
};

// Combines data from both sources, now perfectly unified
const getAllDogs = async () => {
  try {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    return apiInfo.concat(dbInfo);
  } catch (error) {
    console.error('Error combining data sources:', error.message);
    throw error;
  }
};

const getDogsById = async (id) => {
  const allDogs = await getAllDogs();
  const dog = allDogs.find(d => d.id == id);
  if (!dog) {
    throw new Error(`Dog with ID ${id} not found`);
  }
  return dog;
};

const getTemperaments = async () => {
  try {
    const apiInfo = await getApiInfo();
    // The 'temperaments' property is already an array in the normalized apiInfo
    const allTemperaments = apiInfo.flatMap(dog => dog.temperaments);

    const uniqueTemperaments = [...new Set(allTemperaments)].filter(Boolean);

    return uniqueTemperaments.sort(); // Return them sorted alphabetically

  } catch (error) {
    console.error('Error fetching or processing temperaments:', error.message);
    throw new Error('Failed to get temperaments');
  }
};

module.exports = {
  getApiInfo,
  getDbInfo,
  getAllDogs,
  getDogsById,
  getTemperaments,
};
