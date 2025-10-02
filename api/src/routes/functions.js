const axios = require('axios');
const { Dog, Temperament } = require('../db.js');
const { API_KEY } = process.env;

const DEFAULT_IMAGE_URL = 'https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_960_720.jpg';

const getApiInfo = async () => {
  try {
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds', {
      headers: { 'x-api-key': API_KEY },
    });
    return apiUrl.data.map((el) => ({
      id: el.id,
      name: el.name,
      img: el.image ? el.image.url : DEFAULT_IMAGE_URL,
      temperament: el.temperament || 'Unknown',
      weight: el.weight.metric,
      height: el.height.metric,
      life_span: el.life_span,
    }));
  } catch (error) {
    console.error('Error al obtener datos de la API externa:', error.message);
    throw new Error('Fallo al traer datos de la API externa');
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

    // The single source of truth for transforming raw DB data into presentational data.
    return dbDogs.map((dog) => {
      const temperamentsString = (dog.Temperaments || []).map((t) => t.name).join(', ');
      const weightString = `${dog.minWeight} - ${dog.maxWeight}`;
      const heightString = `${dog.minHeight} - ${dog.maxHeight}`;
      // FIX: Correctly construct the life_span string from the atomic data in the DB.
      const lifeSpanString = `${dog.minLifeExp} - ${dog.maxLifeExp} years`;

      // Return the complete, enriched object for use in all views.
      return {
        id: dog.id,
        name: dog.name,
        img: dog.img || DEFAULT_IMAGE_URL,
        temperament: temperamentsString,
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
    console.error('Error al procesar datos de la base de datos local:', error.message);
    throw new Error('Fallo al procesar datos de la base de datos');
  }
};

const getAllDogs = async () => {
  try {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    return apiInfo.concat(dbInfo);
  } catch (error) {
    console.error('Error al combinar los datos:', error.message);
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
}

module.exports = {
  getApiInfo,
  getDbInfo,
  getAllDogs,
  getDogsById,
};
