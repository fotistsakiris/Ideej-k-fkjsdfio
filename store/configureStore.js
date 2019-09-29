import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import ProductReducer from './reducers/products';
import cartReducer from './reducers/cart';


const rootReducer = combineReducers({
    products: ProductReducer,
    cart: cartReducer
});

let composeEnhancers = compose;

// only in developer mode
if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
    return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;