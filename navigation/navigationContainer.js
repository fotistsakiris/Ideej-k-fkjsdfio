// We use this rupper navigator in choice to use Redux...
// And because in startUpScreen we can not navigate to the authScreen.
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// import GameDrawerNavigator from './GameDrawerNavigator';
import GameDrawerNavigator from './GameDrawerNavigator';

const NavigationContainer = (props) => {
	// !! to force it to be true/false
	const isAuth = useSelector((state) => !!state.auth.token);
	const navRef = useRef();
	useEffect(
		() => {
			if (!isAuth) {
				navRef.current.dispatch(NavigationActions.navigate({ routeName: 'Auth' }));
			}
		},
		[ isAuth ]
	);
	return <GameDrawerNavigator ref={navRef} />;
};

export default NavigationContainer;
