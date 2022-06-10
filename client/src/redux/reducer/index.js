
//import { GET_DOGS } from './../actions/index';
import {
    GET_DOGS, CLEAR_PAGE, SEARCH_BREEDS, GET_TEMPERAMENT, FILTER_BY_CREATED, FILTER_BY_TEMPER,
    ORDER_ALPHABETICAL
} from "../actions/actionsTypes";
const initialState = {
    dogs: [],
    allDogs: [],
    temps: [],
    detail: [],
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        
        case GET_DOGS:
            return {
                ...state,
                dogs: action.payload,
                allDogs: action.payload,
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
        case GET_TEMPERAMENT:
            return {
                ...state,
                temps: action.payload
            }
        case FILTER_BY_TEMPER:
            const allDogs = state.allDogs;
            const temperFilter = allDogs.filter((d) => d.temperament && d.temperament.includes(action.payload))
            //const temperFilter = action.payload === 'All' ? state.allDogs : state.allDogs.filter(e => e.state === action.payload)
            //  const temperFilter = action.payload === 'All' ? state.allDogs : state.allDogs.filter(e => e.temps.includes(action.payload))
            return {
                ...state,
                dogs: temperFilter

            }
        case FILTER_BY_CREATED:

            const createdFilter = action.payload === 'DB' ? state.allDogs.filter(e => e.createdInDB) : state.allDogs.filter(e => !e.createdInDB)
            return {
                ...state,
                dogs: action.payload === 'All' ? state.allDogs.name : createdFilter
            }
        case ORDER_ALPHABETICAL:
            const alphaOrder = action.payload === 'Asc' ? 
            state.dogs.sort(function(a, b) {
                if(a.name > b.name) {
                    return 1;
                }
                if(b.name > a.name) {
                    return -1;
                }
                return 0;
            }) :
            state.dogs.sort(function(a, b) {
                if(a.name > b.name) {
                    return -1;
                }
                if(b.name > a.name) {
                    return 1;
                }
                return 0;
            });
            return {
                ...state,
                dogs: alphaOrder
            }
            

        default:
            return state;

    }
}