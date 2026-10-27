import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDogDetail, deleteDog, clearPage } from '../../redux/actions/index';
import style from "./detail.module.css";

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const dogDetail = useSelector(state => state.detail);
  const detailError = useSelector(state => state.detailError);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    dispatch(getDogDetail(id));
    return () => {
      dispatch(clearPage());
    }
  }, [dispatch, id]);

  // The free server sleeps after a while without traffic, so the first request can hang
  // for ~30 seconds instead of failing. Warn the user if loading takes longer than usual.
  useEffect(() => {
    if (dogDetail.id) {
      setIsSlow(false);
      return undefined;
    }
    const timer = setTimeout(() => setIsSlow(true), 6000);
    return () => clearTimeout(timer);
  }, [dogDetail.id]);

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
        {detailError ? (
          <>
            <h1>We couldn't load this breed</h1>
            <p className={style.notice} role="alert">
              This app uses a free server that sleeps after a while without traffic.
              The first visit can fail while it wakes up. Please wait about 30 seconds
              and try again.
            </p>
            <div className={style.noticeActions}>
              <button className={style.button} onClick={() => dispatch(getDogDetail(id))}>
                Try again
              </button>
              <Link to='/home'>
                <button className={style.button}>Back Home</button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Loading...</h1>
            <img src="https://i.gifer.com/origin/ae/ae84325701f6d97ac4ad7e7951ac9063_w200.webp" alt="Loading dog..." />
            {isSlow && (
              <p className={style.notice}>
                This is taking longer than usual. The free server may be waking up after
                being idle, which can take up to 30 seconds. Thanks for your patience!
              </p>
            )}
          </>
        )}
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
