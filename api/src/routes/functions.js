const axios = require('axios');
const { Dog, Temperament } = require('../db.js');
const { API_KEY } = process.env;

// URL de la imagen por defecto para perros sin imagen asignada
const DEFAULT_IMAGE_URL = 'https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_960_720.jpg';

// Función para obtener y normalizar datos de la API externa
const getApiInfo = async () => {
  try {
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds', {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    const apiInfo = apiUrl.data.map((el) => {
      // Asegura que el peso sea un número, incluso si falta
      const weightParts = el.weight.metric ? el.weight.metric.split(' - ') : ['0'];
      const weightMin = parseInt(weightParts[0]) || 0;
      const weightMax = parseInt(weightParts[1]) || weightMin;

      return {
        id: el.id,
        name: el.name,
        image: el.image ? el.image.url : DEFAULT_IMAGE_URL, // Asigna imagen de API o por defecto
        temperament: el.temperament || 'Unknown', // Provee un valor si no hay temperamento
        weightMin: weightMin,
        weightMax: weightMax,
        source: 'api'
      };
    });
    return apiInfo;
  } catch (error) {
    console.error('Error al obtener datos de la API externa:', error.message);
    throw new Error('Fallo al traer datos de la API externa');
  }
};

// Función para obtener y normalizar datos de la base de datos local
const getDbInfo = async () => {
  try {
    const dbDogs = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
    });

    // Mapea los resultados para que coincidan con la estructura de la API
    const formattedDbInfo = dbDogs.map(dog => {
        // Convierte el array de temperamentos en un string
        const temperamentsString = dog.Temperaments.map(t => t.name).join(', ');
        return {
            id: dog.id,
            name: dog.name,
            image: dog.image || DEFAULT_IMAGE_URL, // Asigna imagen de DB o por defecto
            temperament: temperamentsString,
            weightMin: dog.weightMin,
            weightMax: dog.weightMax,
            source: 'db' // Identifica la fuente como base de datos
        }
    });
    return formattedDbInfo;

  } catch (error) {
    console.error('Error al obtener datos de la base de datos local:', error.message);
    throw new Error('Fallo al traer datos de la base de datos');
  }
};

// Función para combinar datos de ambas fuentes
const getAllDogs = async () => {
  try {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal;
  } catch (error) {
    console.error('Error al combinar los datos:', error.message);
    throw error; 
  }
};

module.exports = {
  getApiInfo,
  getDbInfo,
  getAllDogs,
};
