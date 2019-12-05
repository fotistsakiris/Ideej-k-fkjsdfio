import React, { useState } from 'react';
import {
	View,
	ScrollView,
	SafeAreaView,
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
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

import BoldText from '../../components/UI/BoldText';
import Card from '../../components/UI/Card';

import Colours from '../../constants/Colours';

const GameInfoScreen = (props) => {
	const [ error, setError ] = useState(); // error initially is undefined!

	const width = Dimensions.get('window').width; // for putting the buttons in column for small screens
	let cardHeight = 250;
	let cardWidth = 300;
	if (width < 400) {
		cardHeight = 220;
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
		<CustomLinearGradient>
			<SafeAreaView style={styles.screen}>
				<ScrollView contentContainerStyle={styles.scrollViewStyle}>
					{/* <SafeAreaView style={{ flex: 1 }}> */}
					<Card style={{ height: cardHeight * 2.5, width: cardWidth, ...styles.card }}>
						<BoldText style={styles.boldText}>
							Καλώς ήλθατε στην εφαρμογή ΕΝ ΤΟΥΤΩ ΝΙΚΑ. Εδώ θα βρείτε ένα μικρό απάνθισμα
							από ερωτήσεις Εκκλησιαστικού περιεχομένου. Καλή ψυχαγωγία!
						</BoldText>

						<Image
							source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/en-touto-nika.appspot.com/o/nika%20(1).png?alt=media&token=cf439860-d044-47f9-8e59-6c73f69f2462' }}
							style={{ width: cardWidth / 1.5, height: cardHeight / 1.5, margin: 5 }}
						/>
					</Card>

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
						{/* <TouchableOpacity onPress={() => openLink('https://github.com/footios')}>
							<Text style={{ fontSize: 0.05 * width, ...styles.text }}>Git Hub</Text>
						</TouchableOpacity> */}
						<TouchableOpacity
							onPress={() => openLink('https://stackoverflow.com/users/5986141/fotis-tsakiris')}
						>
							<Text style={{ fontSize: 0.05 * width, ...styles.text }}>Stack overflow</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => 'https://web.facebook.com/footios.tsakiris.1'}>
							<Text style={{ fontSize: 0.05 * width, ...styles.text }}>Facebook</Text>
						</TouchableOpacity>
					</Card>
					{/* </SafeAreaView> */}
				</ScrollView>
			</SafeAreaView>
		</CustomLinearGradient>
	);
};

GameInfoScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'EN TOYTV NIKA',
		// Needed for side drawer navigation
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="goBack"
		// 			iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
		// 			onPress={() => navigation.pop()}
		// 		/>
		// 	</HeaderButtons>
		// ),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="cart"
					iconName={Platform.OS === 'android' ? 'md-albums' : 'ios-albums'}
					onPress={() => navigation.navigate({ routeName: 'Cart' })}
				/>
			</HeaderButtons>
		)
	};
};

const styles = StyleSheet.create({
	scrollViewStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	},
	card: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 20,
		marginHorizontal: 20
	},
	text: {
		color: Colours.maroon,
		padding: 7,
		fontFamily: 'GFSNeohellenic-Regular',
		textAlign: 'left'
	},
	boldText: {
		color: Colours.maroon,
		padding: 7,
		fontFamily: 'GFSNeohellenic-Regular',
		textAlign: 'left'
	}
});

export default GameInfoScreen;
