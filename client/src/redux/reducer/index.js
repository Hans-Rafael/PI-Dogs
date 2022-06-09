
//import { GET_DOGS } from './../actions/index';
import { GET_DOGS, CLEAR_PAGE, SEARCH_BREEDS } from "../actions/actionsTypes";
const initialState = {
    dogs: [],
    searchDogs: []
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_DOGS:
            return {
                ...state,
                dogs: action.payload
            }
        case CLEAR_PAGE:
            return {
                ...state,
                dogDetail: {} //estodo inicial de dogDetail
            }
        case SEARCH_BREEDS:
            return {
                ...state,
                searchDogs: action.payload
            }
        default:
            return state;

    }
}