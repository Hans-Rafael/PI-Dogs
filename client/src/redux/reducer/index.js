
import { GET_DOGS } from './../actions/index';
const initialState = {
    dogs: [],
    filterDogs: []
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_DOGS:
            return {
                ...state,
                dogs: action.payload
            }
            default:
                return state;

    }
}