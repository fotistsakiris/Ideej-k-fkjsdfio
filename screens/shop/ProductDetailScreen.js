import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, Text, TouchableOpacity, ScrollView, Image, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
// import PRODUCTS from '../../data/products';
import CustomButton from '../../components/UI/CustomButton';
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
	const currentProductIsFavorite = useSelector((state) => state.products.favoriteProducts.some((product) => product.id === productId));


	const toggleFavoriteHandler = useCallback(
		async () => {
			setError(null);
			try {
				await dispatch(productsActions.toggleFavorite(productId, currentProductIsFavorite));
			} catch (err) {
				setError(err.message);
			}
		},
		[ dispatch, productId, currentProductIsFavorite, setIsFav ]
	);

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>
					Σφάλμα στη διαδικασία αποθήκευσης του προϊόντος ως αγαπημένου. Παρακαλώ ελέγξτε τη σύνδεσή σας.
				</Text>
				<Button title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.chocolate} />
			</View>
		);
	}

	return (
		<ScrollView>
			<View style={styles.icon}>
				<TouchableOpacity style={styles.itemData} onPress={toggleFavoriteHandler}>
					<MaterialIcons name={currentProductIsFavorite ? 'favorite' : 'favorite-border'} size={23} color="red" />
				</TouchableOpacity>
			</View>
			<Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
			{Platform.OS === 'android' ? (
				<View style={styles.button}>
					<CustomButton
						title="Προσθήκη στο καλάθι"
						onPress={() => dispatch(cartActions.addToCard(selectedProduct))}
					/>
				</View>
			) : (
				<View style={styles.button}>
					<Button
						color={Colours.gr_brown_light}
						title="Προσθήκη στο καλάθι"
						onPress={() => dispatch(cartActions.addToCard(selectedProduct))}
					/>
				</View>
			)}

			<Text style={styles.price}>€ {selectedProduct.price.toFixed(2)}</Text>
			<Text style={styles.description}>{selectedProduct.description}</Text>
		</ScrollView>
	);
};

ProductDetailScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('productTitle'),
		// Needed for side drawer navigation
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="goBack"
		// 			iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
		// 			onPress={() => navigation.goBack()}
		// 		/>
		// 	</HeaderButtons>
		// ),
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
		color: '#888',
		textAlign: 'center',
		marginVertical: 2
	},
	description: {
		fontSize: 20,
		textAlign: 'justify',
		padding: 20
	},
	button: {
		marginHorizontal: 5,
		alignSelf: 'center'
	}
});

export default ProductDetailScreen;
