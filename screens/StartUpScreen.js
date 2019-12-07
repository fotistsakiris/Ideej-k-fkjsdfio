import React, { useEffect } from 'react';
import { View, ActivityIndicator, AsyncStorage, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as authActions from '../store/actions/auth';
import * as questionsActions from '../store/actions/questions';
import Colours from '../constants/Colours';
import CustomLinearGradient from '../components/UI/CustomLinearGradient';

const StartUpScreen = (props) => {
	const dispatch = useDispatch();

	// Check the AsyncStorage for a valid token
	useEffect(
		() => {
			const tryLogin = async () => {
				// Note: getItem is asynchronous, so we get a promise
				const userData = await AsyncStorage.getItem('userData');

				if (!userData) {
					props.navigation.navigate('Auth');
					return;
				}
				// parse converts a string to an object or array
				const transformedData = JSON.parse(userData);
				const { token, userId, expiryDate } = transformedData;
				const expirationDate = new Date(expiryDate); // expiryDate is string in ISO format...

				if (expirationDate <= new Date() || !token || !userId) {
					props.navigation.navigate('Auth');
					return;
				}

				const expirationTime = expirationDate.getTime() - new Date().getTime();
				
				// If user is admin, navigate to admin categories
				if (userId === '5E5hc3oOCJRYM4RByLf7ORTIP103') {
					props.navigation.navigate('Admin');
				} else {
					props.navigation.navigate('Main');
				}
				await dispatch(questionsActions.fetchTotalPoints())
				dispatch(authActions.authenticate(token, userId, expirationTime));
			};

			tryLogin();
		},
		[ dispatch ]
	);

	return (
		<CustomLinearGradient>
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colours.moccasin_light} />
			</View>
		</CustomLinearGradient>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default StartUpScreen;
