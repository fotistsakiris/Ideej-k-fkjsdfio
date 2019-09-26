import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import ProductReducer from './store/reducers/products';
import EkthesiNavigator from './navigation/EkthesiNavigator';

const rootReducer = combineReducers({
	products: ProductReducer
});
const store = createStore(rootReducer);

const fetchFonts = () => {
	return Font.loadAsync({
		'GFSNeohellenic-Bold': require('./assets/Fonts/GFSNeohellenic-Bold.ttf'),
		'GFSNeohellenic-BoldItalic': require('./assets/Fonts/GFSNeohellenic-BoldItalic.ttf'),
		'GFSNeohellenic-Regular': require('./assets/Fonts/GFSNeohellenic-Regular.ttf'),
		'GFSNeohellenic-RegularItalic': require('./assets/Fonts/GFSNeohellenic-RegularItalic.ttf')
	});
};

export default function App() {
	const [ fontLoaded, setFontLoaded ] = useState(false);

	if (!fontLoaded) {
		return <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)} />;
	}
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
