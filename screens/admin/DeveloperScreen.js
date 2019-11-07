import React, { useState } from 'react';
import {
	View,
	Text,
	Image,
	Alert,
	TouchableOpacity,
	Linking,
	Button,
	Platform,
	StyleSheet,
	Dimensions
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';

import { LinearGradient } from 'expo-linear-gradient';
import BoldText from '../../components/UI/BoldText';
import Card from '../../components/UI/Card';

import Colours from '../../constants/Colours';

const DeveloperScreen = (props) => {
	const [ error, setError ] = useState(); // error initially is undefined!

	const width = Dimensions.get('window').width; // for putting the buttons in column for small screens
	let cardHeight = 250;
	let cardWidth = 300;
	if (width < 400) {
		cardHeight = 200;
		cardWidth = 250;
	}

	const openLink = (link) => {
		Linking.openURL(link)
			.then((supported) => {
				if (!supported) {
					console.log('Cant handle url');
				} else {
					return Linking.openURL(link);
				}
			})
			.catch((err) => {
				console.error('An error occurred', err);
				Alert.alert('Σφάλμα στη διαδικασία ανοίγματος του συνδέσμου! ', [
					{ text: 'Εντάξει', style: 'default' }
				]);
			});
	};

	return (
		<View style={styles.screen}>
			<LinearGradient
				colors={[ Colours.moccasin_light, Colours.chocolate, Colours.maroon ]}
				// start={{ x: 0, y: 1 }}
				// end={{ x: 0, y: 0 }}
				style={styles.gradient}
			>
				<View style={styles.centered}>
					<Card style={{ height: cardHeight, width: cardWidth, ...styles.card }}>
						<BoldText>Στοιχεία προγραμματιστή</BoldText>
						<TouchableOpacity
							onPress={() => {
								return Platform.OS === 'android'
									? Linking.openURL(
											'mailto:footios76@gmail.com&cc=?subject=yourSubject&body=yourMessage'
										)
									: Linking.openURL(
											'mailto:footios76@gmail.com?cc=?subject=yourSubject&body=yourMessage'
										);
							}}
						>
							<Text style={{ fontSize: 0.05 * width, ...styles.text }}>footios76@gmail.com</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => openLink('https://www.linkedin.com/in/fotis-tsakiris-72331b170/')}
						>
							<Text style={{ fontSize: 0.05 * width, ...{ fontSize: 0.05 * width, ...styles.text } }}>
								Linked in
							</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => openLink('https://github.com/footios')}>
							<Text style={{ fontSize: 0.05 * width, ...styles.text }}>Git Hub</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => openLink('https://stackoverflow.com/users/5986141/fotis-tsakiris')}
						>
							<Text style={{ fontSize: 0.05 * width, ...styles.text }}>Stack overflow</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => 'https://web.facebook.com/footios.tsakiris.1'}>
							<Text style={{ fontSize: 0.05 * width, ...styles.text }}>Facebook</Text>
						</TouchableOpacity>
					</Card>
				</View>
			</LinearGradient>
		</View>
	);
};

DeveloperScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('categoryTitle'),
		// Needed for side drawer navigation
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		)
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="goBack"
		// 			iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
		// 			onPress={() => navigation.pop()}
		// 		/>
		// 	</HeaderButtons>
		// ),
		// headerRight: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="cart"
		// 			iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
		// 			onPress={() => navigation.navigate({ routeName: 'Cart' })}
		// 		/>
		// 	</HeaderButtons>
		// )
	};
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	gradient: {
		flex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	card: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		color: Colours.chocolate,
		padding: 7,
		fontFamily: 'GFSNeohellenic-Regular'
	}
});

export default DeveloperScreen;
