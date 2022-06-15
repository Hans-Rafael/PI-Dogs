import style from "./dog.module.css";
export default function Dog({ img, temperament, weight,name }) {
  return (
    <div className={style.bkgDogCard}>
      <h2>{name}</h2>
      <img className={style.img}src={img} alt="imagen" height={  
        (window.innerWidth > 500) ? "300px" : "200px"
      }
      width={
        (window.innerWidth > 500) ? "300px" : "100px"
      } />
      <p>Weight: {weight} Kg</p>
      <p>Temper: {temperament}</p>
    </div>
  );
}
