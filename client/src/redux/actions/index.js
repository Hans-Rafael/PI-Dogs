import axios from "axios";
import {
  GET_DOGS, GET_BY_NAME, GET_TEMPERAMENT, FILTER_BY_TEMPER, FILTER_BY_CREATED,
  ORDER, POST, GET_DOGS_DETAIL, CLEAR_PAGE, DELETE_DOG
} from './actionsTypes';

// Set the base URL for all axios requests.
// This will use the environment variable on the production server (Vercel) 
// and a default for local development.
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getDogs = () => {
  return function (dispatch) {
    return axios.get('/dogs') // Route is now relative to the base URL
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
      const response = await axios.get(`/dogs?name=${name}`);
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
      const response = await axios.get(`/temperaments?order=${order || 'ASC'}`);
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
      const response = await axios.post('/dogs', payload);
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
        return axios.get(`/dogs/${id}`)
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
            await axios.delete(`/dogs/${id}`);
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
