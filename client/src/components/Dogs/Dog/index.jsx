import React from 'react';
import style from "./dog.module.css";

function Dog({ img, temperament, weight, name }) {
  // SENIOR DEV DEBUG: Log the props to see what the component is actually receiving.
  console.log(`Rendering card for "${name}":`, { temperament: temperament });

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
      {/* SENIOR DEV FIX: Only render the temperament if it exists and is not an empty string */}
      {temperament && <p>Temper: {temperament}</p>}
    </div>
  );
}

export default React.memo(Dog);
