/* import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';
import reducer from './../reducer/index';

const store = createStore( reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);
export default store; */
//********** */
 import { createStore, applyMiddleware,compose } from 'redux';

import thunk from 'redux-thunk';
import reducer from './../reducerMain';

const composeEnhancers = 
(typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore( reducer, composeEnhancers(applyMiddleware(thunk)));

export default store; 

//***con redux-toolkit */
/*
//importamos configuracion de redux-toolkit
import {configureStore} from '@reduxjs/toolkit';
//importamos el/los reducer/s
import reducerMain from '../reducerMain';
//configuramos el store
export default configureStore(
    {
        reducer: reducerMain
    }
)*/