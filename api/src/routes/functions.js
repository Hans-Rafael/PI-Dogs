const axios = require("axios");
const api = "https://api.thedogapi.com/v1/breeds";
const { Dog, Temperament } = require("../db");

//  APIDOGS
const checkImageExists = async (url) => {
  try {
    await axios.head(url);
    return url;
  } catch {
    return "https://cdn.pixabay.com/photo/2017/02/25/15/40/box-2098116_960_720.jpg";
  }
};

const getApiDogs = async () => {
  // Create a configuration object for the axios request
  const config = {
    headers: {
      // Read the API Key from environment variables
      'x-api-key': process.env.API_KEY
    }
  };

  // Pass the config object to the axios call
  const response = await axios(api, config);
  
  const inf = await Promise.all(response.data.map(async (e) => {
    let imgUrl = e.reference_image_id
      ? `https://cdn2.thedogapi.com/images/${e.reference_image_id}.jpg`
      : (e.image && e.image.url)
        ? e.image.url
        : "https://cdn.pixabay.com/photo/2017/02/25/15/40/box-2098116_960_720.jpg";
    imgUrl = await checkImageExists(imgUrl);
    return {
      id: e.id,
      name: e.name.toLowerCase(),
      img: imgUrl,
      temperament: e.temperament ? e.temperament : "",
      weight: e.weight.metric,
      height: e.height.metric,
      lifeExp: e.life_span,
      createdInDB: false,
    };
  }));
  return inf;
};

//getApiDogs()
//  dbDOGS
const getDBDogs = async () => {
  const dbDogs = await Dog.findAll({
    include: Temperament,
  });
  return dbDogs.map((e) => {
    return {
      id: e.id,
      name: e.name,
      img: e.img,
      temperament: e.temperaments.map((e) => e.name).join(", "),
      weight: `${e.minWeight} - ${e.maxWeight}`,
      height: `${e.minHeight} - ${e.maxHeight}`,
      lifeExp: `${e.minLifeExp} - ${e.maxLifeExp}`,
      createdInDB: true,
    };
  });
};

// All Dogs
const getAllDogs = async () => {
  const apiDogs = await getApiDogs();
  const dbDogs = await getDBDogs();
  const allDogs = [...apiDogs, ...dbDogs];
  // return apiDogs;
  //return dbDogs
  return allDogs;
};

//get dog By id
const getDogsById = async (id) => {
  const Dogs = await getAllDogs();
  const dog = Dogs.map((e) => e);
  const filter = dog.filter((e) => e.id == id);
  return filter;
};
// All Temperaments
const getTemperaments = async () => {
  const apiInfo = await getApiDogs();
  // Extrae todos los temperamentos en un solo array
  let temps = apiInfo
    .map((e) => e.temperament)
    .filter(Boolean) // elimina undefined/null
    .join(",") // une todos los strings
    .split(",") // separa por coma
    .map((e) => e.trim()) // elimina espacios
    .filter((e) => e); // elimina strings vacíos
  // Elimina duplicados
  temps = [...new Set(temps)];
  return temps;
};
getTemperaments();

module.exports = {
  getAllDogs,
  getTemperaments,
  getDogsById,
};
