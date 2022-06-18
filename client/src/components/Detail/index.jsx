import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearPage, getDogDetail } from '../../redux/actions/index';
import style from "./detail.module.css";

export default function Detail(props) {

  const { id } = useParams();
  //const{id} = props.match.params;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDogDetail(id));
     return () => {
      dispatch(clearPage());
    } 
  }, [dispatch, id])

  const dogy = useSelector(state => state.detail);
  
  
  return (
    <div id='1' className={style.main}>
      {
        dogy[0]?.id ? //loading ?
          <>
            <div id='2' className={style.text}>
              <h1>{dogy[0]?.name}</h1>
              <div className={style.imgContainer}>
                <img className={style.img} src={dogy[0]?.img} alt={dogy[0]?.name} height={
                  "250px"
                }
                  width={
                    "250px"
                  } />
              </div>
              <p>Temperament: {dogy[0]?.temperament}</p>
              <p>Height: {dogy[0].height} cm </p>
              <p>Weight: {dogy[0]?.weight} Kg</p>
              <p>life expectancy: {dogy[0]?.lifeExp} Years</p>
              <Link to='/home'><button className={style.button} onClick={() => dispatch(clearPage())}>Back Home</button></Link>
            </div>
          </>
          :
           <div id='detailLoading' className={"loading"}>
            <h1>Loading...</h1>
            <img src="https://i.gifer.com/origin/ae/ae84325701f6d97ac4ad7e7951ac9063_w200.webp" alt="loading" />
           
           </div> 

      }

    </div>
  )
}