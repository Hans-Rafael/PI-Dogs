import axios from "axios";
import { GET_DOGS, CLEAR_PAGE, SEARCH_BREEDS, GET_TEMPERAMENT,FILTER_BY_TEMPER, FILTER_BY_CREATED,
  ORDER, } from './actionsTypes';
export const TEMPER = "TEMPER";

export const getDogs = () => {
  /* return (dispatch) => {
    return fetch("http://localhost:3001/dogs")
      .then((response) => response.json())
      .then((response) => {
        dispatch({
          type: GET_DOGS,
          payload: response,
        });
      });
  }; */
  return function (dispatch) {
    return axios.get('http://localhost:3001/dogs')
      .then(response => {
        dispatch({
          type: GET_DOGS,
          payload: response.data
        })
      }) 
      .catch(error => {
        throw error;
      });
  }
};
//
export const clearPage = () => {
  return {
    type: CLEAR_PAGE,
  };
};
//
export function getByName(name) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`http://localhost:3001/dogs?name=${name}`);
      return dispatch({
        type: SEARCH_BREEDS,
        payload: response.data
      })
    }
    catch (error) {
      throw error;
    }
  }
}
//
export function getTemperament() {
  return async function (dispatch) {
    try {
      const response = await axios.get(`http://localhost:3001/temperaments`);
      return dispatch({
        type: GET_TEMPERAMENT,
        payload: response.data
      })
    }
    catch (error) {
      console.log("No se recibieron los temperamentos", error);
    }
  }
}
//
export function filterByTemperament(payload) {
  console.log(payload)
  return {
    type: FILTER_BY_TEMPER,
    payload

  }
}
export function filterByCreated(payload) {
  return {
      type: FILTER_BY_CREATED,
      payload
  };
};
//
export function sort(payload) {
  return {
    type: ORDER,
    payload
  }
}
//

