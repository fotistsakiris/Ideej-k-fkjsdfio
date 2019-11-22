import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';

import BoldText from '../UI/BoldText';

const UserEmail = (props) => {
	const getEmail = async () => {
		// Note: getItem is asynchronous, so we get a promise
		const userData = await AsyncStorage.getItem('userData');

		// parse converts a string to an object or array
		const transformedData = JSON.parse(userData);
		const { email } = transformedData;
		console.log(email);
		return (
			<View>
				<BoldText>email</BoldText>
			</View>
		);
	};
	const email = getEmail();
	console.log(email);

	return getEmail();
};

const styles = StyleSheet.create({});

export default UserEmail;
