import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { post, getTemperament } from './../../redux/actions/index';


export default function Create() {
  const dispatch = useDispatch();
  const history = useHistory();
  const temperamet = useSelector((state) => state.temps);
  const [input, setInput] = useState({
    name: '',
    minHeight: '',
    maxHeight: '',
    minWeight: '',
    maxWeight: '',
    minLifeExp: '',
    maxLifeExp: '',
    img: '',
    temperament: [],
  })

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
  }

  function handleSelect(e) {
    setInput({
      ...input,
      temperament: [...input.temperament, e.target.value],
    })
    console.log(input);
  }
  function handleSubmit(e) {
    e.preventDefault();
    console.log(input);
    dispatch(post(input));
    alert('New dog breed Saved');
    setInput({
      name: '',
      minHeight: '',
      maxHeight: '',
      minWeight: '',
      maxWeight: '',
      minLifeExp: '',
      maxLifeExp: '',
      img: '',
      temperament: [],
    })
    history.push('/home');
  }
  function handleDelete(el) {
    setInput({
      ...input,
      temperament: input.temperament.filter(e => e !== el),
    })
  }

  useEffect(() => {
    dispatch(getTemperament());
  }, [dispatch])


  return (
    <div>
      <Link to="/home"><button>Home</button></Link>
      <h1>Add the details for the new breed!</h1>

      <form onSubmit={e => handleSubmit(e)}>
        <div>
          <label>Breed Name:</label>
          <input type="text" name="name" value={input.name} onChange={e => handleChange(e)} placeholder='Breed...' />
        </div>
        <div>
          <label>Min Height:</label>
          <input type="number" name="minHeight" value={input.minHeight} onChange={e => handleChange(e)} />
          <label>cm</label>
        </div>
        <div>
          <label>Max Height:</label>
          <input type="number" name="maxHeight" value={input.maxHeight} onChange={e => handleChange(e)} />
          <label>cm</label>
        </div>
        <div>
          <label>Min Weight:</label>
          <input type="number" name="minWeight" value={input.minWeight} onChange={e => handleChange(e)} />
          <label>kg</label>
        </div>
        <div>
          <label>Max Weight:</label>
          <input type="number" name="maxWeight" value={input.maxWeight} onChange={e => handleChange(e)} />
          <label>kg</label>
        </div>
        <div>
          <label>Min Life Exp:</label>
          <input type="number" name="minLifeExp" value={input.minLifeExp} onChange={e => handleChange(e)} />
          <label>years</label>
        </div>
        <div>
          <label>Max Life Exp:</label>
          <input type="number" name="maxLifeExp" value={input.maxLifeExp} onChange={e => handleChange(e)} />
          <label>years</label>
        </div>
        <div>
          <label>Image:</label>
          <input type="text" name="img" value={input.img} onChange={e => handleChange(e)} />
        </div>
        <div>
          <label>Select one or more Temperaments:</label>
          <select onChange={e => handleSelect(e)} >
            {
              temperamet.map((t =>
                <option key={t.id} value={t.name}>{t.name}</option>))
            }
          </select>
          <ul>
            {/* <li>{input.temperament.map(e => e + ", ")}</li> */}
            <li>{input.temperament.map((e) => (<div>{e} <button type="button" key={e.id} onClick={() => handleDelete(e)}>'X'</button ></div>))}</li>
          </ul>
        </div>
        <div>
          <button type="submit" >
            Add Breed
          </button>
        </div>
      </form>
    </div>
  )
}




