const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('dog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'The Name is required!' },
        len: [1, 50], // Increased length for more descriptive names
        is: { // FIX: Replaced isAlphanumeric with a RegExp that allows letters and spaces
          args: /^[a-zA-Z\s]*$/,
          msg: 'Name can only contain letters and spaces.'
        }
      }
    },
    img: {
      type: DataTypes.TEXT,
      defaultValue: "http://image.shutterstock.com/image-photo/happy-puppy-dog-smiling-on-260nw-1799966587.jpg",
      validate: { isUrl: true }
    },
    minHeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Minimum height is required!' },
        isNumeric: true
      }
    },
    maxHeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Maximum height is required!' },
        isNumeric: true
      }
    },
    minWeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Minimum weight is required!' },
        isNumeric: true
      }
    },
    maxWeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Maximum weight is required!' },
        isNumeric: true
      }
    },
    minLifeExp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Minimum life expectancy is required!' },
        isNumeric: true
      }
    },
    maxLifeExp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Maximum life expectancy is required!' },
        isNumeric: true
      }
    },
    createdInDB: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    timestamps: false,
  });
};
