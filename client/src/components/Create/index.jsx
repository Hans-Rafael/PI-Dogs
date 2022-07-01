import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { post, getTemperament } from './../../redux/actions/index';
import style from './create.module.css'

export default function Create() {
  const dispatch = useDispatch();

  //const history = useHistory(); //no me desido usar esto

  const temperamet = useSelector((state) => state.temps);
  //mi estado local
  const [errors, setErrors] = useState({});

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

  const imgUrl = "http://image.shutterstock.com/image-photo/happy-puppy-dog-smiling-on-260nw-1799966587.jpg"//img para prueba

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
    setErrors(validate({
      ...input,
      [e.target.name]: e.target.value,
    }))
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
    //history.push('/home');
  }

  function handleDelete(el) {
    setInput({
      ...input,
      temperament: input.temperament.filter(e => e !== el),
    })
  }
  function handleClick(e) {
    e.preventDefault();
    const resultado = window.confirm('Are you sure?, will delete all the data of this breed');
    if (resultado === true) {
      // window.alert('Okay, si estas seguro.');
      window.location.href = '/home'//http://localhost:3000/api/home
    }
  }
  //
  useEffect(() => {
    dispatch(getTemperament());
  }, [dispatch])


  return (
    <div id="1" className={style.main}>
      <button className={style.button} type='submit' onClick={e => { handleClick(e) }} title="return home and you will lose anything written there so far that is not saved ">
        Home
      </button>
      <h1>Add the details for the new breed!</h1>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={style.formIn}>
          <div>
            <label>Breed Name: </label>
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={(e) => handleChange(e)}
              placeholder="Breed..."
              title="MAX 50 alphanumeric characters, on English keyboard, without special characters like @"
            />
          </div><div>
            {errors.name && <p /*className=style.errors */>{errors.name}</p>}
          </div>
          <div>
            <label>Min Height: </label>
            <input
              type="number"
              name="minHeight"
              value={input.minHeight}
              onChange={(e) => handleChange(e)}
              placeholder="add min height"
              title="most be a number max 5 character"
            />
            <label> cm</label>
          </div><div>
            {errors.minHeight && (
              <p /*className=style.errors */>{errors.minHeight}</p>
            )}
          </div>
          <div>
            <label>Max Height: </label>
            <input
              type="number"
              name="maxHeight"
              value={input.maxHeight}
              onChange={(e) => handleChange(e)}
              placeholder="add max height"
              title="most be a number max 5 character"
            />
            <label> cm</label>
          </div><div>
            {errors.maxHeight && (
              <p /*className=style.errors */>{errors.maxHeight}</p>
            )}
          </div>
          <div>
            <label>Min Weight: </label>
            <input
              type="number"
              name="minWeight"
              value={input.minWeight}
              onChange={(e) => handleChange(e)}
              placeholder="add min weight"
              title="most be a number max 5 character"
            />
            <label> kg</label>
          </div><div>
            {errors.minWeight && (
              <p /*className=style.errors */>{errors.minWeight}</p>
            )}
          </div>
          <div>
            <label>Max Weight: </label>
            <input
              type="number"
              name="maxWeight"
              value={input.maxWeight}
              onChange={(e) => handleChange(e)}
              placeholder="add max Weight"
              title="most be a number max 5 character"
            />
            <label> kg</label>
          </div><div>
            {errors.maxWeight && (
              <p /*className=style.errors */>{errors.maxWeight}</p>
            )}
          </div>
          <div>
            <label>Min Life Exp: </label>
            <input
              type="number"
              name="minLifeExp"
              value={input.minLifeExp}
              onChange={(e) => handleChange(e)}
              placeholder="add min number of years"
              title="most be a number max 5 character"
            />
            <label> years</label>
          </div><div>
            {errors.minLifeExp && (
              <p /*className=style.errors */>{errors.minLifeExp}</p>
            )}
          </div>
          <div>
            <label>Max Life Exp: </label>
            <input
              type="number"
              name="maxLifeExp"
              value={input.maxLifeExp}
              onChange={(e) => handleChange(e)}
              placeholder="add max number of years"
              title="most be a number max 5 character"
            />
            <label> years</label>
          </div><div>
            {errors.maxLifeExp && (
              <p /*className=style.errors */>{errors.maxLifeExp}</p>
            )}
          </div>
          <div>
            <label>Image: </label>
            <input
              type="text"
              name="img"
              value={input.img}
              onChange={(e) => handleChange(e)}
              placeholder="add image url"
              title="Remember img most be a url"
            />
          </div><div>
            {errors.img && <p /*className=style.errors */>{errors.img}</p>}
          </div>
          <div>
            <label>Select one or more Temperaments: </label>
            <select
              onChange={(e) => handleSelect(e)}
              title="Select as many as you need"
            >
              {temperamet.map((t) => (
                <option key={t.id} value={t.name} title="Select one or more">
                  {t.name}{" "}
                </option>
              ))}
            </select>
            <ul>
              {/* <li>{input.temperament.map(e => e + ", ")}</li> */}
              <li>
                {input.temperament.map((e) => (
                  <div>
                    {e}{" "}
                    <button className={style.delateButton}
                      type="button"
                      title="doble Click para borrar"
                      key={e.id}
                      onDoubleClick={() => handleDelete(e)}
                    >
                      'X'
                    </button>
                  </div>
                ))}
              </li>
            </ul>
          </div>
        </div>
        <div>
          <button
            className={style.button}
            type="submit"
            title="Save on DataBase and take you back home"
            disabled={
              input.temperament.length === 0 ||
                input.name.length < 1 ||
                errors.name ||
                errors.minHeight ||
                errors.maxHeight ||
                errors.minWeight ||
                errors.maxWeight ||
                errors.minLifeExp ||
                errors.maxLifeExp ||
                errors.img
                ? true
                : false
            }
          >
            Add Breed
          </button>
        </div>
      </form>
    </div>
  );
}
//

function validate(input) {
  let errors = {};
  if (!input.name || input.name.length > 50 || !input.name.match(/^[a-zA-Z0-9\s]+$/) || input.name.charAt(0) === ' ') {
    errors.name = "* NAME is required and most be MAX 50 alphanumeric characters, on English keyboard, without special characters like @, and must start with a letter";
  }
  if (!input.minHeight || !input.maxHeight || input.minHeight > input.maxHeight || input.minHeight < 1 || input.maxHeight.length > 3 || input.minHeight.length > 3 || !input.minHeight.match(/^[0-9]+$/) || !input.maxHeight.match(/^[0-9]+$/)) {
    errors.minHeight = "* HEIGHT is required and must be less than Max Height & both must be max 3 character > 1";
  }
  if (!input.minWeight || !input.maxWeight || input.minWeight > input.maxWeight || input.minWeight < 1 || input.maxWeight.length > 3 || input.minWeight.length > 3 || !input.minWeight.match(/^[0-9]+$/) || !input.maxWeight.match(/^[0-9]+$/)) {
    errors.minWeight = "* WEIGHT is required and must be less than Max Weight & both must be max 3 character > 1";
  }
  if (input.minLifeExp > input.maxLifeExp || !input.minLifeExp.match(/^[0-9]+$/) || !input.maxLifeExp.match(/^[0-9]+$/) || input.maxLifeExp.length > 2 || input.minLifeExp.length > 2) {
    errors.minLifeExp = "* LIFE Exp is required and must be less than Max Life Exp & both max 2 character > 0";
  }
  if (input.img !== '' && !input.img.match(/^(http|https):\/\/[^ "]+$/)) {
    errors.img = "* IMAGE is required but not obligatory & most be a url"
  }
  return errors;
}




