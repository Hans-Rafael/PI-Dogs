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
            const createdFilter = action.payload === 'DB' ? state.allDogs.filter(e => e.createdInDB) : state.allDogs.filter(e => !e.createdInDB);
            return {
                ...state,
                dogs: action.payload === 'All' ? state.allDogs : createdFilter || []
            }
        case ORDER:
            let sort;
            const dogsToSort = [...state.dogs]; // Create a copy to avoid state mutation
            if (action.payload === 'Asc') {
                sort = dogsToSort.sort(function (a, b) {
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    if (b.name.toLowerCase() > a.name.toLowerCase()) return -1;
                    return 0;
                });
            } else if (action.payload === 'Desc') {
                sort = dogsToSort.sort(function (a, b) {
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
                    if (b.name.toLowerCase() > a.name.toLowerCase()) return 1;
                    return 0;
                });
            } else if (action.payload === 'Inc') {
                sort = dogsToSort.sort(function (a, b) {
                    const weightA = parseInt(a.weight.split(' - ')[0]);
                    const weightB = parseInt(b.weight.split(' - ')[0]);
                    return weightA - weightB;
                });
            } else if (action.payload === 'Dec') {
                sort = dogsToSort.sort(function (a, b) {
                    const weightA = parseInt(a.weight.split(' - ')[0]);
                    const weightB = parseInt(b.weight.split(' - ')[0]);
                    return weightB - weightA;
                });
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