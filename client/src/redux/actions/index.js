import axios from "axios";
export const GET_DOGS = "GET_DOGS";

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
