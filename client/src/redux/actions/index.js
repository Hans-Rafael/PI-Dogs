import axios from "axios";
import {
  GET_DOGS, GET_BY_NAME, GET_TEMPERAMENT, FILTER_BY_TEMPER, FILTER_BY_CREATED,
  ORDER, POST, GET_DOGS_DETAIL, CLEAR_PAGE, DELETE_DOG
} from './actionsTypes';

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
        console.error("Error fetching dogs:", error);
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
      });
    } catch (error) {
      // Use a more user-friendly way to show errors if possible
      alert(error.response?.data?.message || "Dog not found");
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
      const response = await axios.post('/api/dogs', payload);
      return response;
    } catch (error) {
      console.error("Error creating dog:", error);
      // Propagate error for component to handle
      throw error;
    }
  }
}

export function getDogDetail(id) {
    return function (dispatch) {
        // Reset detail state before fetching new data
        dispatch(clearPage()); 
        return axios.get(`/api/dogs/${id}`)
            .then(response => {
                dispatch({
                    type: GET_DOGS_DETAIL,
                    payload: response.data
                });
            })
            .catch(error => {
                console.error("Error fetching dog detail:", error);
                // Optionally dispatch an error action
            });
    }
}

export function deleteDog(id) {
    return async function (dispatch) {
        try {
            await axios.delete(`/api/dogs/${id}`);
            return dispatch({
                type: DELETE_DOG,
                payload: id
            });
        } catch (error) {
            console.error("Error deleting dog:", error);
            // Propagate error for component to handle
            throw error;
        }
    }
}

export const clearPage = () => {
  return {
    type: CLEAR_PAGE,
  };
};
