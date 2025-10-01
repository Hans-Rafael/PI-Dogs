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
                if (!dog.temperament) return false;
                if (typeof dog.temperament === 'string') {
                    return dog.temperament.split(', ').includes(selectedTemper);
                }
                if (Array.isArray(dog.temperament)) {
                    return dog.temperament.some(t => t.name === selectedTemper);
                }
                return false;
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
            const dogsToSort = [...state.dogs];
            dogsToSort.sort((a, b) => {
                // Helper to safely parse weight, returning Infinity for invalid/missing values
                const getWeight = (dog) => {
                    if (!dog.weight) return Infinity;
                    const weightValue = parseInt(dog.weight.split(' - ')[0], 10);
                    return isNaN(weightValue) ? Infinity : weightValue;
                };

                switch (action.payload) {
                    case 'Asc':
                        return a.name.localeCompare(b.name);
                    case 'Desc':
                        return b.name.localeCompare(a.name);
                    case 'Inc':
                        // For ascending sort, dogs with no weight go to the end
                        return getWeight(a) - getWeight(b);
                    case 'Dec':
                        // For descending sort, we flip the logic but still want dogs with no weight at the end
                        const weightA = getWeight(a);
                        const weightB = getWeight(b);
                        if (weightA === Infinity) return 1;
                        if (weightB === Infinity) return -1;
                        return weightB - weightA;
                    default:
                        return 0;
                }
            });
            return {
                ...state,
                dogs: dogsToSort
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
