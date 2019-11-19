import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, Dimensions, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomButton from '../../components/UI/CustomButton';
import BoldText from '../../components//UI/BoldText';
import Colours from '../../constants/Colours';

import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

const ProductsOverviewScreen = (props) => {
	const width = Dimensions.get('window').width; // for putting the buttons in column for small screens

	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isRefresing, setIsRefresing ] = useState(false);

	const dispatch = useDispatch();

	const categoryId = props.navigation.getParam('categoryId');
	const products = useSelector((state) =>
		state.products.availableProducts.filter((prod) => prod.categoryIds.indexOf(categoryId) >= 0)
	);
	// const productId = props.navigation.getParam('productId');
	// const isFav = useSelector((state) => state.products.favoriteProducts.some((product) => product.id === productId));

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
			loadProducts().then(() => setIsLoading(false));
		},
		[ dispatch, loadProducts ]
	);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate('DetailScreen', {
			productId: id,
			productTitle: title
		});
	};

	if (error) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Σφάλμα στη διαδικασία φορτώσεως των προϊόντων. Παρακαλώ ελέγξτε τη σύνδεσή σας.</BoldText>
					<Button title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.moccasin_light} />
				</View>
			</CustomLinearGradient>
		);
	}

	if (isLoading) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={Colours.moccasin_light} />
				</View>
			</CustomLinearGradient>
		);
	}

	if (!isLoading && products.length === 0) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Δεν βρέθηκαν προϊόντα στη βάση δεδομένων!</BoldText>
				</View>
			</CustomLinearGradient>
		);
	}

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
				<FlatList
					onRefresh={loadProducts}
					refreshing={isRefresing}
					data={products}
					keyExtractor={(item) => item.id}
					renderItem={(itemData) => (
						<ProductItem
							title={itemData.item.title}
							image={itemData.item.imageUrl}
							onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}
						>
							{Platform.OS === 'android' ? (
								<View style={width < 400 ? styles.actionsSmall : styles.actions}>
									<View style={styles.customButton}>
										<CustomButton
											title="Λεπτομέρειες"
											onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
										/>
									</View>

									<BoldText style={styles.price}>
										{itemData.item.price.toFixed(2)}
										<Text style={styles.euro}>€</Text>
									</BoldText>
									<View style={styles.customButton}>
										<CustomButton
											title="+ καλάθι"
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
									<BoldText style={styles.price}>
										{itemData.item.price.toFixed(2)}
										<Text style={styles.euro}> €</Text>
									</BoldText>
									<View style={styles.button}>
										<Button
											color={Colours.gr_brown_light}
											title="+ καλάθι"
											onPress={() => dispatch(cartActions.addToCard(itemData.item))}
										/>
									</View>
								</View>
							)}
						</ProductItem>
					)}
				/>
			</View>
		</CustomLinearGradient>
	);
};

ProductsOverviewScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('AdminCategoryTitle'),
		// Needed for side drawer navigation
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="menu"
		// 			iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
		// 			onPress={() => navigation.toggleDrawer()}
		// 		/>
		// 	</HeaderButtons>
		// ),
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
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		padding: 20
	},
	price: {
		fontSize: 18,
		color: '#888'
		// marginHorizontal: 1
	},
	euro: {
		fontSize: 14,
		color: '#888'
	},
	actionsSmall: {
		// flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		height: '42%',
		marginHorizontal: 2
	},
	actions: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		height: '18%',
		marginHorizontal: 2
	},
	customButton: {
		marginHorizontal: -7,
		marginVertical: -2
	},
	button: {
		width: '40%',
		paddingHorizontal: -5
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});
export default ProductsOverviewScreen;
