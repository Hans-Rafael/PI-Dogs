import React from 'react';
import style from "./dog.module.css";

function Dog({ img, temperament, weight, name }) {
  // Check if temperament is an array and join the names, otherwise display the original string.
  const displayTemperament = Array.isArray(temperament)
    ? temperament.map(t => t.name).join(', ')
    : temperament;

  return (
    <div className={style.bkgDogCard}>
      <h2>{name}</h2>
      <img 
        className={style.img} 
        src={img} 
        alt={`Imagen de la raza ${name}`}
        height={"300px"}
        width={"300px"}
        loading="lazy"
      />
      <p>Weight: {weight} Kg</p>
      {/* Render the processed temperament string */}
      {displayTemperament && <p>Temper: {displayTemperament}</p>}
    </div>
  );
}

export default React.memo(Dog);
