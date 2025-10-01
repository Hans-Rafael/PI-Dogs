import axios from "axios";
import {
  GET_DOGS, GET_BY_NAME, GET_TEMPERAMENT, FILTER_BY_TEMPER, FILTER_BY_CREATED,
  ORDER, POST, GET_DOGS_DETAIL, CLEAR_PAGE
} from './actionsTypes';
export const TEMPER = "TEMPER";

export const getDogs = () => {
  return function (dispatch) {
    return axios.get('/api/dogs')
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

export function getByName(name) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/api/dogs?name=${name}`);
      return dispatch({
        type: GET_BY_NAME,
        payload: response.data
      })
    } catch (error) {
      alert(error.response.data);
    }
  }
}

export function getTemperament(order) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/api/temperaments?order=${order || 'ASC'}`);
      return dispatch({
        type: GET_TEMPERAMENT,
        payload: response.data
      })
    }
    catch (error) {
      console.log(" ERROR geting response from Temperament URL", error);
    }
  }
}

export function filterByTemperament(payload) {
  try {
    console.log(payload)
    return {
      type: FILTER_BY_TEMPER,
      payload
    }
  }
  catch (error) {
    console.log(error);
  }

}
export function filterByCreated(payload) {
  return {
    type: FILTER_BY_CREATED,
    payload
  };
};

export function sort(payload) {
  return {
    type: ORDER,
    payload
  }
}

export function post(payload) {
  return async function (dispatch) {
    try {
      const info = await axios.post('/api/dogs', payload);
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

export function getDogDetail(id) {
  return function (dispatch) {
    return axios.get(`/api/dogs/${id}`)
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

export const clearPage = () => {
  return {
    type: CLEAR_PAGE,
  };
};
