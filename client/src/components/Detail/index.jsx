import React, { useEffect } from "react";
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDogDetail, deleteDog, clearPage } from '../../redux/actions/index';
import style from "./detail.module.css";

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const dogDetail = useSelector(state => state.detail);

  useEffect(() => {
    dispatch(getDogDetail(id));
    return () => {
      dispatch(clearPage());
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this breed? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await dispatch(deleteDog(id));
        alert("Breed successfully deleted.");
        history.push('/home');
      } catch (error) {
        alert("Failed to delete the breed. Please try again.");
        console.error("Deletion failed:", error);
      }
    }
  }

  if (!dogDetail.id) {
    return (
      <div className={style.loadingContainer}>
        <h1>Loading...</h1>
        <img src="https://i.gifer.com/origin/ae/ae84325701f6d97ac4ad7e7951ac9063_w200.webp" alt="Loading dog..." />
      </div>
    );
  }

  // Handle temperaments as array or string
  const temperamentsToShow = (() => {
    if (!dogDetail.temperaments) return "Not available";
    if (Array.isArray(dogDetail.temperaments)) {
      if (dogDetail.temperaments.length === 0) return "Not available";
      return dogDetail.temperaments.map(t => typeof t === 'object' ? t.name : t).join(', ');
    }
    return dogDetail.temperaments;
  })();

  return (
    <div className={style.main}>
      <div className={style.detailCard}>
        <div className={style.header}>
          <h1>{dogDetail.name}</h1>
        </div>
        <div className={style.content}>
          <div className={style.imageContainer}>
             <img className={style.img} src={dogDetail.img} alt={dogDetail.name} />
          </div>
          <div className={style.info}>
            <p><strong>Temperament:</strong> {temperamentsToShow}</p>
            <p><strong>Height:</strong> {dogDetail.height} cm</p>
            <p><strong>Weight:</strong> {dogDetail.weight} Kg</p>
            <p><strong>Life Span:</strong> {dogDetail.life_span || "Not available"}</p>
          </div>
        </div>
        <div className={style.actions}>
          <Link to='/home'>
            <button className={style.button}>Back Home</button>
          </Link>
          {dogDetail.createdInDB && (
             <button className={`${style.button} ${style.deleteButton}`} onClick={handleDelete}>Delete Breed</button>
          )}
        </div>
      </div>
    </div>
  );
}
