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
      <p>Weight: {weight} Kg</p>
      <p>Temper: {temperament}</p>
    </div>
  );
}
