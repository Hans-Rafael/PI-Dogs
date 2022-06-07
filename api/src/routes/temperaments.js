const { Temperament } = require("../db");
const { getTemperaments } = require("./functions");

//__GET /temperament__:
const getTemper = async (req, res, next) => {
  try {
    //res.send('<h1>Temperaments</h1>');
    const temps = await getTemperaments();
    temps.forEach((e) => {
      Temperament.findOrCreate({
        where: {
          name: e.toLowerCase(),
        },
      });
    });
    const allTemp = await Temperament.findAll();
    res.status(200).send(allTemp);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTemper };
