import React, { useEffect, useState } from 'react';
import { View, AsyncStorage, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
import BoldText from '../../components/UI/BoldText';

const UsersScreen = (props) => {
const [ email, setEmail ] = useState('')

	useEffect(
		() => {
			const getEmail = async () => {
				// Note: getItem is asynchronous, so we get a promise
				const userData = await AsyncStorage.getItem('userData');
				
				// parse converts a string to an object or array
				const transformedData = JSON.parse(userData);
				const { userEmail } = transformedData;
				setEmail(userEmail)
				props.navigation.setParams({'userEmail': userEmail} )
			};
			getEmail();
		},
		[]
	);

	return (
		<CustomLinearGradient>
			<View style={styles.centered}>
				<BoldText>{email}</BoldText>
			</View>
		</CustomLinearGradient>
	);
};


UsersScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('userEmail'),
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="cart"
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navigation.navigate({ routeName: 'Cart' })}
				/>
			</HeaderButtons>
		)
	};
};
const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default UsersScreen;
