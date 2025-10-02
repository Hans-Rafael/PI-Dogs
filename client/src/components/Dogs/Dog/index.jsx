import React from 'react';
import style from "./dog.module.css";

function Dog({ img, temperament, weight, name }) {
  // This function handles both string and array formats for temperaments.
  const getDisplayTemperament = (temps) => {
    if (Array.isArray(temps)) {
      // If it's an array of objects, join their names.
      return temps.map(t => t.name).join(', ');
    } else if (typeof temps === 'string') {
      // If it's already a string, just return it.
      return temps;
    }
    // If it's missing or in an unknown format, return an empty string.
    return '';
  };

  const displayTemperament = getDisplayTemperament(temperament);

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
