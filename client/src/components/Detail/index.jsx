import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearPage, getDogDetail } from '../../redux/actions/index';
import style from "./detail.module.css";

export default function Detail(props) {
  const [loading, setLoading] = useState(false)
  const { id } = useParams();
  //const{id} = props.match.params;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDogDetail(id));

    setLoading(true);

    return () => {
      dispatch(clearPage());
    }
  }, [dispatch, id])

  const dogy = useSelector(state => state.detail);
  console.log(dogy);
  return (
    <div id='1' className={style.main}>
      {
        dogy[0]?.name ? //loading ?
          <>
            <div id='2' className={style.text}>
              <h1>{dogy[0]?.name}</h1>
              <img src={dogy[0]?.img} alt={dogy[0]?.name} height={
                (window.innerWidth > 500) ? "200px" : "100px"
              }
                width={
                  (window.innerWidth > 500) ? "200px" : "100px"
                } />
              <p>Temperament: {dogy[0]?.temperament}</p>
              <p>Height: {dogy[0].height} cm </p>
              <p>Weight: {dogy[0]?.weight} Kg</p>
              <p>life expectancy: {dogy[0]?.lifeExp} Years</p>
            <Link to='/home'><button className={style.button} onClick={() => dispatch(clearPage())}>Back Home</button></Link>
            </div>
          </>
          :
          <div>
            <h1>Loading...</h1>
            <img src="https://media1.giphy.com/media/kZJcpM3gYdlK4D64Ft/200w.webp?cid=ecf05e47i2qbyydmnkoibbiy0ykyrmjjshlub7rxeh4fc62q&rid=200w.webp&ct=g" alt="loading" height="500px" width="500px" />
            {/* <img src="https://media3.giphy.com/media/52qtwCtj9OLTi/100.webp?cid=ecf05e476ngo41xcmymswgc8zkeizixjcjm48zej1q1fjwvm&rid=100.webp&ct=g" alt="loading" /> */}
          </div>
      }

    </div>
  )
}