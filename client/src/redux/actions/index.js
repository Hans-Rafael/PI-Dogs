import axios from "axios";
import {
  GET_DOGS, GET_BY_NAME, GET_TEMPERAMENT, FILTER_BY_TEMPER, FILTER_BY_CREATED,
  ORDER, POST, GET_DOGS_DETAIL, CLEAR_PAGE
} from './actionsTypes';
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
export function getByName(name) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`http://localhost:3001/dogs?name=${name}`);
      return dispatch({
        type: GET_BY_NAME,
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
export function post(payload) {
  return async function (dispatch) {
    try {
      const info = await axios.post(`http://localhost:3001/dogs`, payload);
      //console.log("post Axios del front: ",info);
      return {
        type: POST,
        info,
      }
    }
    catch (error) {
      throw error;
    }
  }
}
//
/* export function getDogDetail(id) {
  return async (dispatch) => {
    try {
      const response = await fetch(`http://localhost:3001/dogs/${id}`);
      const json = await response.json();
      dispatch({
        type: GET_DOGS_DETAIL,
        payload: json
      });
    }
    catch (error) {
      throw error;
    }
  }
} */
export function getDogDetail(id) {
  return function (dispatch) {
    return axios.get(`http://localhost:3001/dogs/${id}`)
      .then(response => {
        dispatch({
          type: GET_DOGS_DETAIL,
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

