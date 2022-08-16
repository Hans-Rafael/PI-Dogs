import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Dog from "./Dog";
import {
    getDogs, getTemperament, filterByTemperament, filterByCreated, sort
} from './../../redux/actions';
import Paging from "./Paging";
import style from "./dogsHome.module.css";
import SearchBar from "./SearchBar";
import { useHistory } from "react-router-dom";


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
    const [order, setOrder] = useState('')//
    const indexOfLastDog = currentPage * charactersPerPage;//8 
    const indexOfFirstDog = indexOfLastDog - charactersPerPage;//0  
    const currentDogs = allCharacters.slice(indexOfFirstDog, indexOfLastDog);

    const Paginited = (pageNumber) => setCurrentPage(pageNumber);


   // const history = useHistory()
    ////history.push('/home')
    //handlers

    function handlerClick(event) {
        event.preventDefault();
        dispatch(getDogs());
        setCurrentPage(1);
    }

    function handleTemperament(e) {
       // e.preventDefault();
       if (e.target.value === "ALL") {
              dispatch(getDogs());
              setCurrentPage(1);
              return;}
        else {
        dispatch(filterByTemperament(e.target.value));//e.target.value<=payload 
        setCurrentPage(1);
        }
    };

    function handleCreated(e) {
        e.preventDefault();
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
                <div id='Titulo'>
                    <h1 className={style.txt}>Henry Dogs</h1>
                    <h3>By Hans Garcia</h3>
                </div>
                <div id='Searchbar'>
                    <SearchBar />
                </div>
                <div id='SortBar' className={style.sortBar}>
                  
                    <select className={style.button} onChange={(e) => handleCreated(e)} title='you can select from were get info' >
                        <option value='ALL'>All Breeds</option>
                        <option value='API'>Api Breeds</option>
                        <option value='DB'>Created Breeds</option>
                    </select>
                   
                    {<select className={style.button} onChange={(e) => handleTemperament(e)} title='you can select a temperament'>
                        <option value='ALL'>Temperaments</option>
                        {allTemp && allTemp.map((t) => (
                            <option key={t.name} value={t.name}>
                                {t.name}
                            </option>
                        ))}
                    </select>}
                 
                    <select className={style.button} onChange={(e) => handleOrder(e)} title="sort search">
                        <option value='Asc'>A-Z</option>
                        <option value='Desc'>Z-A</option>
                        <option value='Inc'>Min-Max weight</option>
                        <option value='Dec'>Max-Min weight</option>
                    </select>
                    
                    <Link to='/create' className={style.button}>
                        <button className={style.buttonIn} title='take you to the form'>Create new breed</button>
                    </Link>

                    <button className={style.buttonR} onClick={e => { handlerClick(e) }}> Refrech page</button>

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
    }
    return (<div id="mainLoading" className={style.loading}>
        <h1>Cargando...</h1>
        {/* <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading" /> */}
       <img src="https://th.bing.com/th/id/R.632d51142994066cdfb410ef7e5089a9?rik=pri9VRZj8W3kgQ&riu=http%3a%2f%2fi8.glitter-graphics.org%2fpub%2f116%2f116018lyjo7r0y5j.gif&ehk=PVk3RbS1fzpZJzP28mZCL%2filh36TIACLksK2CKg3PWg%3d&risl=&pid=ImgRaw&r=0" alt="loading" />
       
    </div>)
}
