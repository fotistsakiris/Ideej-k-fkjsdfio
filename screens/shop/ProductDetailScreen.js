import React, { useState, useCallback } from 'react';
import { Platform, View, Text, TouchableOpacity, ScrollView, Image, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
// import PRODUCTS from '../../data/products';
import CustomButton from '../../components/UI/CustomButton';
import BoldText from '../../components/UI/BoldText';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';

import Colours from '../../constants/Colours';

const ProductDetailScreen = (props) => {
	const [ error, setError ] = useState(); // error initially is undefined!

	const dispatch = useDispatch();

	const productId = props.navigation.getParam('productId');
	const selectedProduct = useSelector((state) =>
		state.products.availableProducts.find((prod) => prod.id === productId)
	);
	const currentProductIsFavorite = useSelector((state) =>
		state.products.favoriteProducts.some((product) => product.id === productId)
	);

	const toggleFavoriteHandler = useCallback(
		async () => {
			setError(null);
			try {
				await dispatch(productsActions.toggleFavorite(productId, currentProductIsFavorite));
			} catch (err) {
				setError(err.message);
			}
		},
		[ dispatch, productId, currentProductIsFavorite ]
	);

	if (error) {
		return (
			<View style={styles.centered}>
				<BoldText>
					Σφάλμα στη διαδικασία αποθήκευσης του προϊόντος ως αγαπημένου. Παρακαλώ ελέγξτε τη σύνδεσή σας.
				</BoldText>

				{Platform.OS === 'android' ? (
					<CustomButton title="Δοκιμάστε Ξανά" onPress={toggleFavoriteHandler} color={Colours.chocolate} />
				) : (
					<Button title="Δοκιμάστε Ξανά" onPress={toggleFavoriteHandler} color={Colours.chocolate} />
				)}
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<LinearGradient
				colors={[ 'white', Colours.chocolate, Colours.maroon ]}
				start={{ x: 0, y: 1 }}
				end={{ x: 0, y: 0 }}
				style={styles.gradient}
			>
				<View style={styles.flatListContainer}>
					<ScrollView>
						<View style={styles.icon}>
							<TouchableOpacity style={styles.itemData} onPress={toggleFavoriteHandler}>
								<MaterialIcons
									name={currentProductIsFavorite ? 'favorite' : 'favorite-border'}
									size={23}
									color="white"
								/>
							</TouchableOpacity>
						</View>
						<Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
						{Platform.OS === 'android' ? (
							<View style={styles.button}>
								<CustomButton
									style={Colours.chocolate}
									title="Προσθήκη στο καλάθι"
									onPress={() => dispatch(cartActions.addToCard(selectedProduct))}
								/>
							</View>
						) : (
							<View style={styles.button}>
								<Button
									color="white"
									title="Προσθήκη στο καλάθι"
									onPress={() => dispatch(cartActions.addToCard(selectedProduct))}
								/>
							</View>
						)}

						<BoldText style={styles.price}>
							{selectedProduct.price.toFixed(2)}
							<Text style={styles.euro}> €</Text>
						</BoldText>
						<Text style={styles.description}>{selectedProduct.description}</Text>
					</ScrollView>
				</View>
			</LinearGradient>
		</View>
	);
};

ProductDetailScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('productTitle'),
		// Needed for side drawer navigation
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="goBack"
					iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
					onPress={() => navigation.goBack()}
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
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		padding: 20
	},
	icon: {
		alignSelf: 'center',
		margin: 2
	},
	image: {
		width: '100%',
		height: 300,
		resizeMode: 'contain',
		margin: 2
	},
	price: {
		fontSize: 18,
		color: 'white',
		textAlign: 'center',
		marginVertical: 2
	},
	euro: {
		fontSize: 14,
		color: 'white'
	},
	description: {
		fontSize: 20,
		textAlign: 'justify',
		padding: 20
	},
	button: {
		marginHorizontal: 5,
		alignSelf: 'center'
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default ProductDetailScreen;
