import axios from "axios";
import {
  GET_DOGS, GET_BY_NAME, GET_TEMPERAMENT, FILTER_BY_TEMPER, FILTER_BY_CREATED,
  ORDER, POST, GET_DOGS_DETAIL, CLEAR_PAGE, DELETE_DOG
} from './actionsTypes';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";


export const getDogs = () => {
  return function (dispatch) {
    return axios.get(`${API_URL}/dogs`) // Using absolute URL
      .then(response => {
        dispatch({
          type: GET_DOGS,
          payload: response.data
        })
      })
      .catch(error => {
        console.error("Error fetching dogs:", error);
      });
  }
};

export function getByName(name) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/dogs?name=${name}`); // Using absolute URL
      return dispatch({
        type: GET_BY_NAME,
        payload: response.data
      });
    } catch (error) {
      alert(error.response?.data?.message || "Dog not found");
    }
  }
}

export function getTemperament(order) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/temperaments?order=${order || 'ASC'}`); // Using absolute URL
      return dispatch({
        type: GET_TEMPERAMENT,
        payload: response.data
      });
    } catch (error) {
      console.error("Error fetching temperaments:", error);
    }
  }
}

export function filterByTemperament(payload) {
  return {
    type: FILTER_BY_TEMPER,
    payload
  };
}

export function filterByCreated(payload) {
  return {
    type: FILTER_BY_CREATED,
    payload
  };
}

export function sort(payload) {
  return {
    type: ORDER,
    payload
  };
}

export function post(payload) {
  return async function () {
    try {
      // Using absolute URL
      const response = await axios.post(`${API_URL}/dogs`, payload);
      return response;
    } catch (error) {
      console.error("Error creating dog:", error);
      throw error;
    }
  }
}

export function getDogDetail(id) {
    return function (dispatch) {
        dispatch(clearPage());
        // Using absolute URL
        return axios.get(`${API_URL}/dogs/${id}`)
            .then(response => {
                dispatch({
                    type: GET_DOGS_DETAIL,
                    payload: response.data
                });
            })
            .catch(error => {
                console.error("Error fetching dog detail:", error);
            });
    }
}

export function deleteDog(id) {
    return async function (dispatch) {
        try {
            // Using absolute URL
            await axios.delete(`${API_URL}/dogs/${id}`);
            return dispatch({
                type: DELETE_DOG,
                payload: id
            });
        } catch (error) {
            console.error("Error deleting dog:", error);
            throw error;
        }
    }
}

export const clearPage = () => {
  return {
    type: CLEAR_PAGE,
  };
};
