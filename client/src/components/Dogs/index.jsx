import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Dog from "./Dog";
import { getDogs, getTemperament, filterByTemperament,filterByCreated,
    sort} from './../../redux/actions';
import Paging from "./Paging";
import style from "./dogsHome.module.css";
import SearchBar from "./SearchBar";


export default function Dogs() {
    let dogs = useSelector((state) => state.dogs);
   // console.log(dogs);
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDogs());
    }, [dispatch])

    const allTemp = useSelector((state) => state.temps);
    
    useEffect(() => {
        dispatch(getTemperament());
    }, [dispatch]);


    //paging
    const allCharacters = useSelector((state) => state.dogs);
    const [currentPage, setCurrentPage] = useState(1);
    const [charactersPerPage, setCharactersPerPage] = useState(8);
    const [order, setOrder] = useState('')
    const indexOfLastDog = currentPage * charactersPerPage;//8 
    const indexOfFirstDog = indexOfLastDog - charactersPerPage;//0  
    const currentDogs = allCharacters.slice(indexOfFirstDog, indexOfLastDog);

    const Paginited = (pageNumber) => setCurrentPage(pageNumber);


    //handlers

    function handlerClick(event) {
        event.preventDefault();
        dispatch(getDogs());
        setCurrentPage(1);
    }

    function handleTemperament(e) {
        e.preventDefault();
        dispatch(filterByTemperament(e.target.value));//e.target.value<=payload
        setCurrentPage(1);
    };

    function handleCreated(e) {
        //e.preventDefault();
        dispatch(filterByCreated(e.target.value));
        setCurrentPage(1);
    }
    function handleOrder(e){
        e.preventDefault();
        dispatch(sort(e.target.value));
        setCurrentPage(1);
        setOrder(`Ordenado ${e.target.value}`)
    }
    //console.log(dogs, "*****ALl info de api de la back*****");
    ////
    if (dogs.length !== 0) {
        return <div> <h1>Home</h1>
            <button onClick={e => { handlerClick(e) }}> Refrech page</button>

            <Link to='/create'>
            <button>Create new breed</button>
            </Link>
            <div>
                <select onChange={(e)=>handleCreated(e)} >
                    <option value='ALL'>All Breeds</option>
                    <option value='API'>Api Breeds</option>
                    <option value='DB'>Created Breeds</option>
                </select>
                
                {<select onChange={(e) =>handleTemperament(e)}>
                    <option value='ALL'>All Temperaments</option>
                    {allTemp && allTemp.map((t) => (
                        <option key={t.name} value={t.name}>
                            {t.name}
                        </option>
                    ))}
                </select>}

                <select onChange={(e)=>handleOrder(e)}>
                    <option value='Asc'>A-Z</option>
                    <option value='Desc'>Z-A</option>
                    <option value='Inc'>Min-Max weight</option>
                    <option value='Dec'>Max-Min weight</option>
                </select>
            </div>

            <div>
            <SearchBar/>
                
            </div>
            <div>
                <Paging
                    charactersPerPage={charactersPerPage}
                    allCharacter={allCharacters.length}
                    Paginited={Paginited}
                />
            </div>
            <div className={style.num}>
                Page: {currentPage}
            </div>
            <div>
                {currentDogs?.map((e) => {
                    return <Link to={`/home/${e.id}`} key={e.id}>
                        <Dog key={e.id} name={e.name} img={e.img} temperament={e.temperament} weight={e.weight}></Dog>
                    </Link>
                })
                }

                {/* {dogs.map((e) => {
                    return <Link key={e.id} to={`/home/${e.id}`}>
                        <Dog name={e.name} img={e.img} temperament={e.temperament} height={e.height} weight={e.weight} life={e.life} />
                    </Link>

                })} */}
            </div>
        </div>
    } else {
        return <div>
            <h1>Cargando...</h1>{/*si tengo tempo agregar un componet o un css se vea mejor  */}
        </div>
    }
}
