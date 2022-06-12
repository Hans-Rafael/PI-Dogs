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
        dispatch(getByName(name));
        setName("");
        
    }

    return (
        <div>
            <input type='text' placeholder='Search By Breed' onChange={(e) => handlerInChange(e)} className={style.placeholder} />
            <button type='submit' onClick={(e) => handlerSubmit(e)} className={style.button}>Search</button>

        </div>
    )
}

export default SearchBar

/* import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getByName } from '../../../redux/actions';


export default function SearchBar() {

    const dispatch = useDispatch();
    const [name, setName] = useState('');

    function handlerChange(e) {
        e.preventDefault();
        setName(e.target.value);
    }
    function handlerSubmit(e) {
        e.preventDefault();
        dispatch(getByName(name));
    }
    return(
    <div>
        <input type="text" placeholter='Breed ...' onChange={e => handlerChange(e)}></input>
        <button type='submit' onClick={e => handlerSubmit(e)} >Find</button>
    </div>)
} */

