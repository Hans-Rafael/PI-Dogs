//const { Router } = require("express");
const { Dog, Temperament } = require("../db");
const { getAllDogs, getDogsById } = require("./functions");

//GET /dogs & //__GET /dogs?name="..."__:

const getDogs = async (req, res, next) => {
  //res.send('<h1>Dog by name or all from api y db</h1>');
  try {
    const dogs = await getAllDogs();
    const data = dogs.map((e) => e);
    const { name } = req.query;
    if (name) {
      let dogName = data.filter((e) =>
        e.name.toLowerCase().includes(name.toLowerCase())
      );
      dogName.length
        ? res.status(200).send(dogName)
        : res.send("there is no dog with that name");
    } else {
      return res.status(200).send(data);
    }
  } catch (err) {
    next(err);
  }
};

//__GET /dogs/{idRaza}__:
const getById = async (req, res, next) => {
  try {
    //res.send('<h1>Dog by id</h1>')
    const id = req.params.id;
    if (id.length > 0 || id.length < 37 || isUUID(id) === true) {
      const dog = await getDogsById(id);
      res.status(200).send(dog);
    } else {
      res.send("there is no dog with that id");
    }
  } catch (err) {
    next(err);
  }
};

//__POST /dog__:
const createDog = async (req, res, next) => {
  try {
    //res.send("<h1>Post dog Created </h1>");
    const {
      name,
      img,
      temperament,
      minHeight,
      maxHeight,
      minWeight,
      maxWeight,
      minLifeExp,
      maxLifeExp,
      createdInDb,
    } = req.body;

    if (!name || !temperament || !minWeight) {
      return res.status(400).send("missing parameters");
    }
    const dogCreated = await Dog.create({
      name,
      img,
      minHeight,
      maxHeight,
      minWeight,
      maxWeight,
      minLifeExp,
      maxLifeExp,
      createdInDb,
      temperament
    });
     const dogTemperament = await Temperament.findAll({
     where: {
       name: temperament,
     },
   });
   
    dogCreated.addTemperament(dogTemperament);
    // console.log(dogCreated)
    res.status(201).send(`dog ${dogCreated.name} added to db`);
  } catch (err) {
    next(err);
  }
};

//__DELETE /dog/:id
const delateDog = async (req, res, next) => {
  try {
    //res.send("<h1>Dog Deleted</h1>");
    const { id } = req.params;
    Dog.destroy({
      where: { id: id }
    });
    res.status(200).send(`Dog of id: ${id} has been deleted`);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDogs, getById, createDog, delateDog };
