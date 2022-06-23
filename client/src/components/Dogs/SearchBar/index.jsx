import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getByName } from '../../../redux/actions'
import style from './search.module.css'

function SearchBar() {
    const dispatch = useDispatch();
    const [name, setName] = useState(''); //seteo mi estado local

    function handlerInChange(e) {
        e.preventDefault();
        setName(e.target.value);
        console.log(name);
        


    }
    function handlerSubmit(e) {
        e.preventDefault();
        if (name === '') {
            return alert("please insert a name")
        }
        else {
        dispatch(getByName(name));
        setName("");
        document.getElementById("search").value = "";
        }
    }
    

    return (
        <div className={style.select}>
            <input id='search' type='text' placeholder='Search By Breed' onChange={(e) => handlerInChange(e)} className={style.placeholder} />
            <button id='submit' onClick={(e) => handlerSubmit(e)} className={style.button}>Search</button>

        </div>
    )
}

export default SearchBar

