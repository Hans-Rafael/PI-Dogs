import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearPage, getDogDetail } from './../../redux/actions/index';

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
    <div>
      {
        dogy[0]?.name ? //loading ?
          <div>
            <h1>Holaaaaaaa: </h1>
            <h1>{dogy[0]?.name}</h1>
            <img src={dogy[0]?.img} alt={dogy[0]?.name } height={  
        (window.innerWidth > 500) ? "200px" : "100px"
      }
      width={
        (window.innerWidth > 500) ? "200px" : "100px"
      }/>
            <p>Temperament: {dogy[0]?.temperament}</p>
            <p>Height: {dogy[0].height} cm </p>
            <p>Weight: {dogy[0]?.weight} Kg</p>
            <p>life expectancy: {dogy[0]?.lifeExp} Years</p>
            <Link to='/home'><button onClick={() => dispatch(clearPage())}>Back Home</button></Link>
          </div>
          :
          <div>
            <h1>Loading...</h1>
          </div>
      }

    </div>
  )
}