import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import ProductReducer from './store/reducers/products';
import EkthesiNavigator from './navigation/EkthesiNavigator'
const rootReducer = combineReducers({
  products: ProductReducer
});
const store = createStore(rootReducer);

export default function App() {
	return (
		<Provider store={store}>
			<EkthesiNavigator />
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
