
//import { GET_DOGS } from './../actions/index';
import {
    GET_DOGS, CLEAR_PAGE, GET_BY_NAME, GET_TEMPERAMENT, FILTER_BY_CREATED, FILTER_BY_TEMPER,
    ORDER, POST, GET_DOGS_DETAIL
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

        case GET_BY_NAME:
            return {
                ...state,
                dogs: action.payload
            }
        case GET_TEMPERAMENT:
            return {
                ...state,
                temps: action.payload
            }
        case FILTER_BY_TEMPER:
            const allDogs = state.allDogs;
            const temperFilter = allDogs?.filter((d) => d.temperament && d.temperament.includes(action.payload));
            return {
                ...state,
                dogs: temperFilter

            }
        case FILTER_BY_CREATED:
            //const f =state.allDogs.filter(e => e.createdInDB)
            const createdFilter = action.payload === 'DB'? state.allDogs.filter(e => e.createdInDB) : state.allDogs.filter(e => !e.createdInDB)   
            return {
                ...state,
                dogs: action.payload === 'All' ? state.allDogs : (createdFilter)? createdFilter : "db is empty"
            }
        case ORDER:
            let sort
            if (action.payload === 'Asc') {
                sort = state.dogs.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (b.name > a.name) {
                        return -1;
                    }
                    return 0;
                })
            } if (action.payload === 'Desc') {
                sort = state.dogs.sort(function (a, b) {
                    if (a.name > b.name) {
                        return -1;
                    }
                    if (b.name > a.name) {
                        return 1;
                    }
                    return 0;
                });
            }
            if (action.payload === 'Inc') {
                sort = state.dogs.sort(function (a, b) {
                    if (parseInt(a.weight.substr(0, 2)) > parseInt(b.weight.substr(0, 2))) {
                        return 1;
                    }
                    if (parseInt(b.weight.substr(0, 2)) > parseInt(a.weight.substr(0, 2))) {
                        return -1;
                    }
                    return 0;
                })
            }
            if (action.payload === 'Dec') {
                sort = state.dogs.sort(function (a, b) {
                    if (parseInt(a.weight.substr(0, 2)) > parseInt(b.weight.substr(0, 2))) {
                        return -1;
                    }
                    if (parseInt(b.weight.substr(0, 2)) > parseInt(a.weight.substr(0, 2))) {
                        return 1;
                    }
                    return 0;
                })
            }
            return {
                ...state,
                dogs: sort
            }
        case POST:
            return {
                ...state
            }
        case GET_DOGS_DETAIL:
            return {
                ...state,
                detail: action.payload
            }
        case CLEAR_PAGE:
            return {
                ...state,
                detail: [] //estodo inicial de dogDetail
            }


        default:
            return state;

    }
}