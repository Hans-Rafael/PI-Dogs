const axios = require('axios');
const { Dog, Temperament } = require('../db.js');
const { API_KEY } = process.env;

// Función para obtener datos de la API externa
const getApiInfo = async () => {
  console.log('Iniciando la obtención de datos desde la API externa...');
  try {
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds', {
      headers: {
        'x-api-key': API_KEY,
      },
    });
    console.log('Datos de la API externa recibidos con éxito.');

    const apiInfo = await apiUrl.data.map((el) => {
      return {
        id: el.id,
        name: el.name,
        image: el.image.url,
        temperament: el.temperament,
        weightMin: parseInt(el.weight.metric.split(' - ')[0]),
        weightMax: parseInt(el.weight.metric.split(' - ')[1]),
        source: 'api'
      };
    });
    return apiInfo;
  } catch (error) {
    console.error('Error al obtener datos de la API externa:', error.message);
    throw new Error('Fallo al traer datos de la API externa');
  }
};

// Función para obtener datos de la base de datos local
const getDbInfo = async () => {
  console.log('Iniciando la obtención de datos desde la base de datos local...');
  try {
    const dbData = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
    });
    console.log('Datos de la base de datos local recibidos con éxito.');
    return dbData;
  } catch (error) {
    console.error('Error al obtener datos de la base de datos local:', error.message);
    throw new Error('Fallo al traer datos de la base de datos');
  }
};

// Función para combinar datos de ambas fuentes
const getAllDogs = async () => {
  console.log('Combinando datos de la API y la base de datos...');
  try {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    console.log('Datos combinados con éxito. Total de perros encontrados:', infoTotal.length);
    return infoTotal;
  } catch (error) {
    console.error('Error al combinar los datos:', error.message);
    // Re-lanzamos el error para que el controlador de la ruta lo atrape
    throw error; 
  }
};

module.exports = {
  getApiInfo,
  getDbInfo,
  getAllDogs,
};
