require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME,
} = process.env;

const {Pool} = require('pg')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  
})
pool.connect((err) => {
  if (err) throw err
  console.log("Connect to PostgreSQL successfully!")
})


// next is a link used to deploy en heroku
//PAKETE NEED TAMBIEN: PROJECT_PATH =>/api or carpetaName de la api
// https://github.com/timanovsky/subdir-heroku-buildpack //
let sequelize =
new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dogs`,
  { logging : false, native:false, omitNull: false  }
);

/* const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dogs`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
}); */
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Dog,Temperament } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Dog.belongsToMany(Temperament, { through: 'dogTemperament' })
Temperament.belongsToMany(Dog, { through: 'dogTemperament' })
// Sincroniza los modelos con la base de datos (crea las tablas si no existen)
sequelize.sync()
  .then(() => console.log('Tablas sincronizadas'))
  .catch(err => console.error('Error al sincronizar tablas:', err));

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
  pool,
};
