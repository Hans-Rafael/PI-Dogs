export default function Dog({ img, temperament, weight,name }) {
  return (
    <div>
      <h2>{name}</h2>
      <img src={img} alt="imagen" height={  
        (window.innerWidth > 500) ? "200px" : "100px"
      }
      width={
        (window.innerWidth > 500) ? "200px" : "100px"
      } />
      <p>Peso: {weight} Kg</p>
      <p>Temperamento: {temperament}</p>
    </div>
  );
}
