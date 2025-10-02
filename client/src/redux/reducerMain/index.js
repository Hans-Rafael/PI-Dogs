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

            if (selectedTemper === 'All') {
                return {
                    ...state,
                    dogs: allDogs
                }
            }

            const temperFilter = allDogs.filter(dog => {
                // CORREGIDO: Usar 'temperaments' en lugar de 'temperament'
                if (!dog.temperaments) return false;

                if (typeof dog.temperaments === 'string') {
                    return dog.temperaments.includes(selectedTemper);
                } else if (Array.isArray(dog.temperaments)) {
                    return dog.temperaments.some(t => t.name === selectedTemper);
                }
                return false;
            });

            return {
                ...state,
                dogs: temperFilter
            }

        case FILTER_BY_CREATED:
            const allDogs2 = state.allDogs;
            if (action.payload === 'All') {
                return {
                    ...state,
                    dogs: allDogs2
                }
            }
            const createdFilter = action.payload === 'created'
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

                // CORREGIDO: Usar los valores del componente de filtros
                switch (action.payload) {
                    case 'ASC':
                        return a.name.localeCompare(b.name);
                    case 'DESC':
                        return b.name.localeCompare(a.name);
                    case 'WEIGHT_ASC':
                        return getWeight(a) - getWeight(b);
                    case 'WEIGHT_DESC':
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
