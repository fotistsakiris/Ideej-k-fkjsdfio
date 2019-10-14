import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import BoldText from '../../components//UI/BoldText';
import Colours from '../../constants/Colours';

import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';

const ProductsOverviewScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isFav, setIsFav ] = useState(true);
	const [ isRefresing, setIsRefresing ] = useState(false);
	const dispatch = useDispatch();
	const categoryId = props.navigation.getParam('categoryId');
	const products = useSelector((state) =>
		state.products.availableProducts.filter((prod) => prod.categoryIds.indexOf(categoryId) >= 0)
	);

	const loadProducts = useCallback(
		async () => {
			setError(null);
			setIsRefresing(true);
			try {
				await dispatch(productsActions.fetchProducts());
			} catch (err) {
				setError(err.message);
			}
			setIsRefresing(false);
		},
		[ dispatch, setIsLoading, setError ]
	);

	// loadProducts after focusing
	useEffect(
		() => {
			const willFocusEvent = props.navigation.addListener('willFocus', loadProducts);
			return () => willFocusEvent.remove();
		},
		[ loadProducts ]
	);

	// loadProducts initially...
	useEffect(
		() => {
			setIsLoading(true);
			loadProducts();
			setIsLoading(false);
		},
		[ dispatch, loadProducts ]
	);

	const toggleFavoriteHandler = (id) => {
		dispatch(productsActions.toggleFavorite(id, isFav));
		setIsFav(prevState => !prevState)
	} 

	const selectItemHandler = (id, title) => {
		props.navigation.navigate('DetailScreen', {
			productId: id,
			productTitle: title
		});
	};

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>Σφάλμα στη διαδικασία φορτώσεως των προϊόντων. Παρακαλώ ελέγξτε τη σύνδεσή σας.</Text>
				<Button title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.chocolate} />
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colours.chocolate} />
			</View>
		);
	}

	if (!isLoading && products.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>Δεν βρέθηκαν προϊόντα στη βάση δεδομένων!</Text>
			</View>
		);
	}

	return (
		<FlatList
			onRefresh={loadProducts}
			refreshing={isRefresing}
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					title={itemData.item.title}
					image={itemData.item.imageUrl}
					isFavorite={isFav}
					onToggleFavorite={() => toggleFavoriteHandler(itemData.item.id)}
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

ProductsOverviewScreen.navigationOptions = (navData) => {
	return {
		headerTitle: navData.navigation.getParam('categoryTitle'),
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="menu"
		// 			iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
		// 			onPress={() => navData.navigation.toggleDrawer()}
		// 		/>
		// 	</HeaderButtons>
		// ),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navData.navigation.navigate({ routeName: 'Cart' })}
				/>
			</HeaderButtons>
		)
	};
};

const styles = StyleSheet.create({
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
export default ProductsOverviewScreen;
