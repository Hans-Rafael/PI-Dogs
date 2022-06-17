import style from "./dog.module.css";
export default function Dog({ img, temperament, weight, name }) {
  return (
    <div className={style.bkgDogCard}>
      <h2>{name}</h2>
      <img className={style.img} src={img} alt="imagen" height={ "300px" }
        width={   "300px" } />
      <p>Weight: {weight} Kg</p>
      <p>Temper: {temperament}</p>
    </div>
  );
}
