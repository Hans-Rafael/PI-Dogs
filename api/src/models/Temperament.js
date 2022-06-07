const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('temperament', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'The temperament are required!' },
        //isNumeric: false,
        len: [1, 30],
      }
    }
  }, {
    timestamps: false, // this disables createdat and updatedat
  });
};