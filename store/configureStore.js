import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import QuestionsReducer from './reducers/questions';
import CartReducer from './reducers/cart';
import ChoicesReducer from './reducers/choices';
import authReducer from './reducers/auth';


const rootReducer = combineReducers({
    questions: QuestionsReducer,
    cart: CartReducer,
    choices: ChoicesReducer,
    auth: authReducer
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