import {
    GET_DOGS, CLEAR_PAGE, GET_BY_NAME, GET_TEMPERAMENT, FILTER_BY_CREATED, FILTER_BY_TEMPER,
    ORDER, POST, GET_DOGS_DETAIL
} from "../actions/actionsTypes";

const initialState = {
    dogs: [],
    allDogs: [], // This is our permanent list of dogs
    temps: [],
    detail: [],
}

export default function reducer(state = initialState, action) {
    switch (action.type) {

        case GET_DOGS:
            return {
                ...state,
                dogs: action.payload,
                allDogs: action.payload, // Store a copy of all dogs
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
            const selectedTemper = action.payload;

            const temperFilter = allDogs.filter(dog => {
                // If a dog has no temperament, it shouldn't be in the results
                if (!dog.temperament) return false;

                // Case 1: Temperament from API is a String (e.g., "Brave, Loyal, Kind")
                if (typeof dog.temperament === 'string') {
                    // Split the string into an array and check for an exact match
                    return dog.temperament.split(', ').includes(selectedTemper);
                }

                // Case 2: Temperament from DB is an Array of Objects (e.g., [{name: 'Brave'}, {name: 'Loyal'}])
                if (Array.isArray(dog.temperament)) {
                    return dog.temperament.some(t => t.name === selectedTemper);
                }

                return false; // Don't include if format is unknown
            });

            return {
                ...state,
                dogs: temperFilter
            }

        case FILTER_BY_CREATED:
            const allDogs2 = state.allDogs;
            if (action.payload === 'ALL') {
                return {
                    ...state,
                    dogs: allDogs2
                }
            }
            const createdFilter = action.payload === 'DB'
                ? allDogs2.filter(e => e.createdInDB)
                : allDogs2.filter(e => !e.createdInDB);
            return {
                ...state,
                dogs: createdFilter
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
                    const weightA = a.weight ? parseInt(a.weight.split(' - ')[0], 10) : Infinity;
                    const weightB = b.weight ? parseInt(b.weight.split(' - ')[0], 10) : Infinity;
                    return (isNaN(weightA) ? Infinity : weightA) - (isNaN(weightB) ? Infinity : weightB);
                });
            } else if (action.payload === 'Dec') {
                sort = dogsToSort.sort(function (a, b) {
                    const weightA = a.weight ? parseInt(a.weight.split(' - ')[0], 10) : -Infinity;
                    const weightB = b.weight ? parseInt(b.weight.split(' - ')[0], 10) : -Infinity;
                    return (isNaN(weightB) ? -Infinity : weightB) - (isNaN(weightA) ? -Infinity : weightA);
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
                detail: []
            }

        default:
            return state;
    }
}
