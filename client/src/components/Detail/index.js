import React from 'react'
import { useParams,Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { clearPage,getDogDetail } from './../../redux/actions/index';
import { useEffect } from 'react';
 

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  //Recivo mis 2 parametror al montar el componente
  useEffect(() => {
    dispatch(getDogDetail(id));
  }, [dispatch])
  const dogy = useSelector(state => state.detail);
  console.log(dogy.name);
  return (
    <div>
      <h1>Holaaaaaaa: </h1>
        <div>
          <h1>{dogy.name}</h1>
          {/*  <img src={dogy.img} alt={dogy.name} />
          {/* <p>Temperament: {dogy.temperament}</p>}
          <p>Height: {dogy.minHeight}-{dogy.maxHeight}cm</p>
          <p>Weight: {dogy.minWeight}-{dogy.maxWeight}Kg</p>
          <p>life expectancy: {dogy.minLifeExp} - {dogy.minLifeExp} Years</p>
          <button onClick={() => dispatch(clearPage())}>Back Home</button> */}
        </div>
      
    </div>
  )
}