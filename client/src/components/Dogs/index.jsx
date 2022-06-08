import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dog from "../Dog";
import {getDogs} from './../../redux/actions';

export default function Dogs(){
    let dogs = useSelector((state)=>state.dogs)
    //console.log(dogs);
    let dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getDogs());
    },[])
    console.log(dogs,"*****ALl info de api en back*****");
    return <div>
        {dogs.map((e)=>{
            return <Dog key={e.id} name={e.name} img={e.img} temperament={e.temperament} weight={e.weight}/>
        })}    
        <Dog/>
    </div>
}