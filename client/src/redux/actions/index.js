import axios from "axios";
import { GET_DOGS, CLEAR_PAGE, SEARCH_BREEDS } from './actionsTypes';

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
      }) //despachar un componete de error si hubo un error por unos 5 seg,luego
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
      const response = await axios.get(`http:localhost:3001/dogs?name=${name}`);
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