import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { useScreens } from 'react-native-screens';

// import EkthesisDrawerNavigator from './navigation/ekthesisDrawerNavigator';
// import EkthesisBottomTabNavigator from './navigation/ekthesisBottomTabNavigator';
import NavigationContainer from './navigation/navigationContainer';
import configureStore from './store/configureStore';

useScreens(); 

const store = configureStore();


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
			<NavigationContainer />
		</Provider>
	);
}
