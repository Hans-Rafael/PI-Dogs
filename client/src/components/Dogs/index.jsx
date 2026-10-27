import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDogs } from '../../redux/actions/index';
import { Link } from 'react-router-dom';
import Dog from './Dog';
import style from "./dogsHome.module.css";
import Paginate from './Paging/index';
import SearchBar from './SearchBar/index';
import Filters from './Filters/index';

function Dogs() {
  const dispatch = useDispatch();
  const dogs = useSelector(state => state.dogs);
  const dogsError = useSelector(state => state.dogsError);
  const [currentPage, setCurrentPage] = useState(1);
  const dogsPerPage = 8;

  const indexOfLastDog = currentPage * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = dogs.slice(indexOfFirstDog, indexOfLastDog);

  const setPaginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(getDogs());
  }, [dispatch]);

  // Reset a la página 1 cuando cambia la lista de perros (por filtros)
  useEffect(() => {
    setCurrentPage(1);
  }, [dogs]);

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.headerContent}>
          <h1 className={style.title}>🐕 Henry Dogs</h1>
          <Link to="/create" className={style.createLink}>
            <button className={style.createBtn}>+ New Breed</button>
          </Link>
        </div>
      </header>

      <div className={style.controlsSection}>
        <SearchBar />
        <Filters />
      </div>

      {dogsError && (
        <div className={style.errorBanner} role="alert">
          <p>
            We couldn't load the breeds. The server runs on a free plan, so it sleeps
            after a while without traffic and the first request can take a minute or fail
            until it wakes up.
          </p>
          <button className={style.retryBtn} onClick={() => dispatch(getDogs())}>
            Try again
          </button>
        </div>
      )}

      <div className={style.resultsInfo}>
        <p>Showing {currentDogs.length} of {dogs.length} breeds</p>
      </div>

      <Paginate charactersPerPage={dogsPerPage} allCharacter={dogs.length} Paginited={setPaginate} currentPage={currentPage} />
      
      <div className={style.dogsGrid}>
        {currentDogs.length > 0 ? (
          currentDogs.map(dog => (
            <Link to={`/home/${dog.id}`} key={dog.id} className={style.cardLink}>
              <Dog 
                name={dog.name} 
                img={dog.img} 
                temperament={dog.temperaments} 
                weight={dog.weight} 
              />
            </Link>
          ))
        ) : (
          <div className={style.noResults}>
            <p>🔍 No dogs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(Dogs);
