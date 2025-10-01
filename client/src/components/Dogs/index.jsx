import { React, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Dog from "./Dog";
import {
    getDogs, getTemperament, filterByTemperament, filterByCreated, sort
} from './../../redux/actions';
import Paging from "./Paging";
import style from "./dogsHome.module.css";
import SearchBar from "./SearchBar";

export default function Dogs() {
    const dispatch = useDispatch();
    const dogs = useSelector((state) => state.dogs);
    const allTemp = useSelector((state) => state.temps);

    const [currentPage, setCurrentPage] = useState(1);
    const [charactersPerPage] = useState(8);
    const [order, setOrder] = useState('');
    const [temperamentOrder, setTemperamentOrder] = useState('ASC');

    useEffect(() => {
        dispatch(getDogs());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getTemperament(temperamentOrder));
    }, [dispatch, temperamentOrder]);

    const currentDogs = useMemo(() => {
        const indexOfLastDog = currentPage * charactersPerPage;
        const indexOfFirstDog = indexOfLastDog - charactersPerPage;
        return dogs.slice(indexOfFirstDog, indexOfLastDog);
    }, [dogs, currentPage, charactersPerPage]);

    const Paginited = (pageNumber) => setCurrentPage(pageNumber);

    function handlerClick(event) {
        event.preventDefault();
        dispatch(getDogs());
        setCurrentPage(1);
    }

    function handleTemperament(e) {
        if (e.target.value === "ALL") {
            dispatch(getDogs());
        } else {
            dispatch(filterByTemperament(e.target.value));
        }
        setCurrentPage(1);
    }

    function handleCreated(e) {
        dispatch(filterByCreated(e.target.value));
        setCurrentPage(1);
    }

    function handleOrder(e) {
        dispatch(sort(e.target.value));
        setCurrentPage(1);
        setOrder(`Ordenado ${e.target.value}`);
    }

    function handleTemperamentOrder(e) {
        setTemperamentOrder(e.target.value);
    }

    // Componente de carga inicial
    if (dogs.length === 0 && allTemp.length === 0) {
        return (
            <div id="mainLoading" className={style.loading}>
                <h1>Cargando...</h1>
                <img src="https://th.bing.com/th/id/R.632d51142994066cdfb410ef7e5089a9?rik=pri9VRZj8W3kgQ&riu=http%3a%2f%2fi8.glitter-graphics.org%2fpub%2f116%2f116018lyjo7r0y5j.gif&ehk=PVk3RbS1fzpZJzP28mZCL%2filh36TIACLksK2CKg3PWg%3d&risl=&pid=ImgRaw&r=0" alt="Perro animado corriendo para indicar la carga" />
            </div>
        )
    }

    return (
        <div className={style.bkgAll}>
            <div id='navBar' className={style.navBar}>
                <div id='Titulo'>
                    <h1 className={style.txt}>Henry Dogs</h1>
                    <h3>By Hans Garcia</h3>
                </div>
                <div id='Searchbar'>
                    <SearchBar />
                </div>
                <div id='SortBar' className={style.sortBar}>
                    <select className={style.button} onChange={handleCreated} title='Filter by origin' aria-label="Filter dogs by origin">
                        <option value='ALL'>All Breeds</option>
                        <option value='API'>Api Breeds</option>
                        <option value='DB'>Created Breeds</option>
                    </select>

                    <select className={style.button} onChange={handleTemperament} title='Filter by temperament' aria-label="Filter dogs by temperament">
                        <option value='ALL'>All Temperaments</option>
                        {allTemp && allTemp.map((t) => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                    </select>

                    <select className={style.button} onChange={handleTemperamentOrder} title="Sort temperaments alphabetically" aria-label="Sort temperaments alphabetically">
                        <option value='ASC'>Temperament A-Z</option>
                        <option value='DESC'>Temperament Z-A</option>
                    </select>

                    <select className={style.button} onChange={handleOrder} title="Sort breeds" aria-label="Sort breeds by name or weight">
                        <option value='Asc'>Name A-Z</option>
                        <option value='Desc'>Name Z-A</option>
                        <option value='Inc'>Min-Max Weight</option>
                        <option value='Dec'>Max-Min Weight</option>
                    </select>

                    <Link to='/create' className={style.button}>
                        <button className={style.buttonIn} title='Go to the creation form'>Create New Breed</button>
                    </Link>

                    <button className={style.buttonR} onClick={handlerClick}>Clear Filters</button>
                </div>

                <div className={style.paging}>
                    <Paging
                        charactersPerPage={charactersPerPage}
                        allCharacter={dogs.length}
                        Paginited={Paginited}
                    />
                </div>
                <div className={style.num}>
                    Page: {currentPage}
                </div>
            </div>

            <div className={style.boxCards}>
                {currentDogs.length > 0 ? (
                    currentDogs.map((e) => (
                        <Link to={`/home/${e.id}`} key={e.id} title='Click to see breed details'>
                            <Dog name={e.name} img={e.img} temperament={e.temperament} weight={e.weight} />
                        </Link>
                    ))
                ) : (
                    <div className={style.noResults}>
                        <h2>No breeds found</h2>
                        <p>Try changing the filters or clearing them.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
