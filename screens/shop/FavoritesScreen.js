import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Button, FlatList, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';

import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';

// import DefaultText from '../components/UI/DefaultText';

const FavoritesScreen = (props) => {
	// const [ isLoading, setIsLoading ] = useState(false);
	// const [ error, setError ] = useState(); // error initially is undefined!
	// const [ isRefresing, setIsRefresing ] = useState(false);
	const dispatch = useDispatch();
	const favProducts = useSelector((state) => state.products.favoriteProducts);


	// const loadFavProducts = useCallback(
	// 	async () => {
	// 		setError(null);
	// 		setIsRefresing(true);
	// 		try {
	// 			await dispatch(productsActions.fetchFavProducts());
	// 		} catch (err) {
	// 			setError(err.message);
	// 		}
	// 		setIsRefresing(false);
	// 	},
	// 	[ dispatch, setIsLoading, setError ]
	// );

	// // loadFavProducts after focusing
	// useEffect(
	// 	() => {
	// 		const willFocusEvent = props.navigation.addListener('willFocus', loadFavProducts);
	// 		return () => willFocusEvent.remove();
	// 	},
	// 	[ loadFavProducts ]
	// );

	// // loadFavProducts initially...
	// useEffect(
	// 	() => {
	// 		setIsLoading(true);
	// 		loadFavProducts();
	// 		setIsLoading(false);
	// 	},
	// 	[ dispatch, loadFavProducts ]
	// );

	const selectItemHandler = (id, title) => {
		props.navigation.navigate('DetailScreen', {
			productId: id,
			productTitle: title
		})
	} 

	// if (error) {
	// 	return (
	// 		<View style={styles.centered}>
	// 			<Text>Σφάλμα στη διαδικασία φορτώσεως των αγαπημένων προϊόντων. Παρακαλώ ελέγξτε τη σύνδεσή σας.</Text>
	// 			<Button title="Δοκιμάστε Ξανά" onPress={loadFavProducts} color={Colours.chocolate} />
	// 		</View>
	// 	);
	// }

	// Render something when no favorites are selected.
	if (!favProducts || favProducts.length === 0) {
		return (
			<View style={styles.content}>
				<BoldText
				>{`Ακόμη δεν έχετε επιλέξει αγαπημένα. \nΠαρακαλώ κάντε τις επιλογές σας.\nΘα χαρούμε να σας εξυπηρετήσουμε!`}</BoldText>
			</View>
		);
	}

	// if (isLoading) {
	// 	return (
	// 		<View style={styles.centered}>
	// 			<ActivityIndicator size="large" color={Colours.chocolate} />
	// 		</View>
	// 	);
	// }

	return (
		<FlatList
			// onRefresh={loadFavProducts}
			// refreshing={isRefresing}
			data={favProducts}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					title={itemData.item.title}
					image={itemData.item.imageUrl}
					onToggleFavorite={() => dispatch(productActions.toggleFavorite(itemData.item.id))}
					onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}
				>
					{Platform.OS === 'android' ? (
						<View style={styles.actions}>
							<View>
								<CustomButton
									title="Λεπτομέρειες"
									onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
								/>
							</View>
							<BoldText style={styles.price}>€ {itemData.item.price.toFixed(2)}</BoldText>
							<View>
								<CustomButton
									title="... στο καλάθι"
									onPress={() => dispatch(cartActions.addToCard(itemData.item))}
								/>
							</View>
						</View>
					) : (
						<View style={styles.actions}>
							<View style={styles.button}>
								<Button
									color={Colours.gr_brown_light}
									title="Λεπτομέρειες"
									onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
								/>
							</View>
							<BoldText style={styles.price}>€ {itemData.item.price.toFixed(2)}</BoldText>
							<View style={styles.button}>
								<Button
									color={Colours.gr_brown_light}
									title="... στο καλάθι"
									onPress={() => dispatch(cartActions.addToCard(itemData.item))}
								/>
							</View>
						</View>
					)}
				</ProductItem>
			)}
		/>
	);
};

FavoritesScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Αγαπημένα',
		// Needed for side drawer navigation
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
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navigation.navigate({ routeName: 'Cart' })}
				/>
			</HeaderButtons>
		)
	};
};

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		margin: 12
	},
	price: {
		fontSize: 18,
		color: '#888'
	},
	actions: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		height: '18%',
		paddingHorizontal: 20
	},
	button: {
		width: '50%'
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default FavoritesScreen;
