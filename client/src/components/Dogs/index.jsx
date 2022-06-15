import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Dog from "./Dog";
import {
    getDogs, getTemperament, filterByTemperament, filterByCreated,
    sort
} from './../../redux/actions';
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
    function handleOrder(e) {
        e.preventDefault();
        dispatch(sort(e.target.value));
        setCurrentPage(1);
        setOrder(`Ordenado ${e.target.value}`)
    }
    //console.log(dogs, "*****ALl info de api de la back*****");
    ////
    if (dogs.length !== 0) {
        return <div className={style.bkgAll}>
            <div id='navBar' className={style.navBar}> 
            <h1>Home</h1>
            <div id='refre-goCre' className={style.refCre}>
            <button onClick={e => { handlerClick(e) }}> Refrech page</button>

            <Link to='/create'>
                <button title='take you to the form'>Create new breed</button>
            </Link>
            </div>
            <div id='select1' className={style.select}>
                <div>
                <select onChange={(e) => handleCreated(e)} title='you can select from were get info' >
                    <option value='ALL'>All Breeds</option>
                    <option value='API'>Api Breeds</option>
                    <option value='DB'>Created Breeds</option>
                </select>
                </div>
                <div>
                {<select onChange={(e) => handleTemperament(e)} title='you can select a temperament'>
                    <option value='ALL'>All Temperaments</option>
                    {allTemp && allTemp.map((t) => (
                        <option key={t.name} value={t.name}>
                            {t.name}
                        </option>
                    ))}
                </select>}
                </div>
                <div>
                <select onChange={(e) => handleOrder(e)} title="sort search">
                    <option value='Asc'>A-Z</option>
                    <option value='Desc'>Z-A</option>
                    <option value='Inc'>Min-Max weight</option>
                    <option value='Dec'>Max-Min weight</option>
                </select>
                </div>
            </div>

            <div id='Searchbar'>
                <SearchBar />

            </div>
            <div className={style.paging}>
                <Paging
                    charactersPerPage={charactersPerPage}
                    allCharacter={allCharacters.length}
                    Paginited={Paginited}
                />
            </div>
            <div className={style.num}>
                Page: {currentPage}
            </div>
            </div>
            <div>
                <div className={style.boxCards}>
                    {currentDogs?.map((e) => {
                        return <Link to={`/home/${e.id}`} key={e.id} title='You could go to see the details by clicking on the image'>
                            <Dog key={e.id} name={e.name} img={e.img} temperament={e.temperament} weight={e.weight} ></Dog>
                        </Link>
                    })
                    }
                </div>

                {/* {dogs.map((e) => {
                    return <Link key={e.id} to={`/home/${e.id}`}>
                        <Dog name={e.name} img={e.img} temperament={e.temperament} height={e.height} weight={e.weight} life={e.life} />
                    </Link>

                })} */}
            </div>
        </div>
    } else {
        return (<div className={style.loading}>
            <h1>Cargando...</h1>
            <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading" />

        </div>)
    }
}