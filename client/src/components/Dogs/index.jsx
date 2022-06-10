import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Dog from "./Dog";
import { getDogs, getTemperament, filterByTemperament,filterByCreated,
    orderalphabetical, } from './../../redux/actions';
import Paging from "./Paging";
import style from "./dogsHome.module.css";
export default function Dogs() {
    let dogs = useSelector((state) => state.dogs);
    //console.log(dogs);
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDogs());
    }, [])

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
    function handleAlpha(e){
        e.preventDefault();
        dispatch(orderalphabetical(e.target.value));
        setCurrentPage(1);
        setOrder(`Ordenado ${e.target.value}`)
    }
    //console.log(dogs, "*****ALl info de api de la back*****");
    ////
    if (dogs.length !== 0) {
        return <div> <h1>Home</h1>
            <button onClick={e => { handlerClick(e) }}> Refrech page</button>

            <button>Create Breed</button>
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

                <select onChange={(e)=>handleAlpha(e)}>
                    <option value='Asc'>A-Z</option>
                    <option value='Desc'>Z-A</option>
                </select>
                <select>
                    <option value='INC'>Min-Max weight</option>
                    <option value='DEC'>Max-Min weight</option>
                </select>
                <button> Sort</button>
            </div>

            <div>
                {/* <SearchBar></SearchBar> */}Sbar
                <button>Find</button>
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
                {currentDogs?.map((i) => {
                    return <Link to={`/home/${i.id}`} key={i.id}>
                        <Dog key={i.id} name={i.name} img={i.img} temperament={i.temperament} weight={i.weight}></Dog>
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
            <h1>Cargando...</h1>
        </div>
    }
}
