import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Dog from "./Dog";
import { getDogs } from './../../redux/actions';
import Paging from "./Paging";
import style from "./dogsHome.module.css";
export default function Dogs() {
    let dogs = useSelector((state) => state.dogs)
    //console.log(dogs);
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDogs());
    }, [])

    //paging
    const allCharacters = useSelector((state) => state.dogs);
    const [currentPage, setCurrentPage] = useState(1);
    const [charactersPerPage, setCharactersPerPage] = useState(8);//muestre todo en 3 page seria...
    //   const [order,setOrder]=useState('');
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
    //console.log(dogs, "*****ALl info de api en back*****");
    if (dogs.length !== 0) {
        return <div> <h1>Home</h1>
            <button onClick={e => { handlerClick(e) }}> Refrech page</button>
            <button>Create Breed</button>
            <div>
                <select>
                    <option>Temperamento</option>
                </select>
                <select>
                    <option value='all'>All Raza</option>
                    <option value='api'>Api Razas</option>
                    <option value='db'>Created Razas</option>
                </select>
                <select>
                    <option value='asc'>A-Z</option>
                    <option value='desc'>Z-A</option>
                </select>
                <select>
                    <option value='minw'>Min-May weight</option>
                    <option value='maxw'>May-Min weight</option>
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
                Paginited={ Paginited}
            />
            </div>
            <div className={style.num}>
            Page: {currentPage}
            </div>
            <div>
                {currentDogs?.map((i) => {
                    return <Link to={`/home/${i.id}`} key={i.id}>
                        <Dog key={i.id} name={i.name} img={i.img} temperament={i.temperament} weight={i.weight}></Dog>
                    </Link> })
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
