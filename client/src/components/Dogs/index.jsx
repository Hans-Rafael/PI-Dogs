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
  const [currentPage, setCurrentPage] = useState(1);
  const dogsPerPage = 6;

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
    <div className={style.bkg}>
      <h1>Henry Dogs</h1>
      <h2>by HANS</h2>
      
      <Link to="/create">
        <button>Create New Breed</button>
      </Link>
      
      <SearchBar />
      
      <Filters />

      <Paginate charactersPerPage={dogsPerPage} allCharacter={dogs.length} Paginited={setPaginate} currentPage={currentPage} />
      
      <div className={style.dogsgrid}>
        {currentDogs.length > 0 ? (
          currentDogs.map(dog => (
            <Link to={`/home/${dog.id}`} key={dog.id}>
              <Dog 
                name={dog.name} 
                img={dog.img} 
                temperament={dog.temperaments} 
                weight={dog.weight} 
              />
            </Link>
          ))
        ) : (
          <p>No dogs found for the selected filters.</p>
        )}
      </div>
    </div>
  );
}

export default React.memo(Dogs);
