import {
    GET_DOGS, CLEAR_PAGE, GET_BY_NAME, GET_TEMPERAMENT, FILTER_BY_CREATED, FILTER_BY_TEMPER,
    ORDER, POST, GET_DOGS_DETAIL, DELETE_DOG
} from "../actions/actionsTypes";

const initialState = {
    dogs: [],
    allDogs: [], 
    temps: [],
    detail: {}, 
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
            const selectedTemper = action.payload;

            // SENIOR DEV FIX: Updated filter logic to use the normalized 'temperaments' array.
            const temperFilter = allDogs.filter(dog => {
                // Ensure the dog has the temperaments property and it's an array.
                if (!dog.temperaments || !Array.isArray(dog.temperaments)) return false;
                // Check if the temperaments array includes the selected temperament.
                return dog.temperaments.includes(selectedTemper);
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
                        return getWeight(a) - getWeight(b);
                    case 'Dec':
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
                detail: {} 
            }

        case DELETE_DOG:
            return {
                ...state,
                dogs: state.dogs.filter(dog => dog.id !== action.payload),
                allDogs: state.allDogs.filter(dog => dog.id !== action.payload),
            }

        default:
            return state;
    }
}
