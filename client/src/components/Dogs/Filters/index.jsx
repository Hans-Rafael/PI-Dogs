import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTemperament, filterByTemperament, filterByCreated, sort } from '../../../redux/actions';
import style from './filters.module.css';

function Filters() {
  const dispatch = useDispatch();
  const temperaments = useSelector(state => state.temperaments);

  useEffect(() => {
    dispatch(getTemperament());
  }, [dispatch]);

  const handleFilterByTemperament = (e) => {
    dispatch(filterByTemperament(e.target.value));
  };

  const handleFilterByCreated = (e) => {
    dispatch(filterByCreated(e.target.value));
  };

  const handleSort = (e) => {
    dispatch(sort(e.target.value));
  };

  return (
    <div className={style.filterContainer}>
      <select onChange={handleSort}>
        <option value="ASC">A-Z</option>
        <option value="DESC">Z-A</option>
        <option value="WEIGHT_ASC">Weight (asc)</option>
        <option value="WEIGHT_DESC">Weight (desc)</option>
      </select>
      <select onChange={handleFilterByTemperament}>
        <option value="All">All Temperaments</option>
        {temperaments.map(temp => (
          <option key={temp.name} value={temp.name}>{temp.name}</option>
        ))}
      </select>
      <select onChange={handleFilterByCreated}>
        <option value="All">All</option>
        <option value="created">Created</option>
        <option value="api">Existing</option>
      </select>
    </div>
  );
}

export default Filters;
