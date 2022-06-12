const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('dog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false ,
            validate : {
        notEmpty : {msg : 'The Name is required!'},
        len: [1,20],
    } 
    },
    img: {
      type:DataTypes.TEXT, /// ''
      defaultValue:"http://image.shutterstock.com/image-photo/happy-puppy-dog-smiling-on-260nw-1799966587.jpg",//"./defoult_img.png",
      //validate : { isUrl: true,}

    },
    minHeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notEmpty : {msg : 'se nesecita Altura!'},
        len: [1,5], 
        isNumeric: true, 
    }
    },
    maxHeight: {
      type: DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : 'se nesecita Altura!'},
        len: [1,5],//numero de digitos
        isNumeric: true, 
    }
    },
    minWeight: {
      type: DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : 'se nesecita el peso!'},
        len: [1,3],//numero
        isNumeric: true, 
    }
    },
    maxWeight: {
      type: DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : 'se nesecita el peso!'},
        len: [1,3],//nunero metric kg
        isNumeric: true, 
    }
    },
    minLifeExp: {
      type: DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : 'se nesecita el peso!'},
        len: [1,5],//nunero Years
        isNumeric: true, 
    }
      
    },
    maxLifeExp: {
      type: DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : 'se nesecita el peso!'},
        len: [1,5],//nunero Years
        isNumeric: true, 
    }
    },
    createdInDB:{
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    }
  },
  {
    timestamps: false,
  });
};
