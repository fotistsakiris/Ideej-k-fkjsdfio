import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, ActivityIndicator, FlatList, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';

// import DefaultText from '../components/UI/DefaultText';

const FavoritesScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isRefresing, setIsRefresing ] = useState(false);
	const dispatch = useDispatch();
	const userIdExists = useSelector((state) => state.auth.userId);
	const favProducts = useSelector((state) => state.products.favoriteProducts);

	// console.log('favProducts', favProducts);

	const loadFavProducts = useCallback(
		async () => {
			setError(null);
			setIsRefresing(true);
			try {
				await dispatch(productsActions.fetchFavProducts());
			} catch (err) {
				setError(err.message);
			}
			setIsRefresing(false);
		},
		[ dispatch, setIsLoading, setError ]
	);

	// loadFavProducts after focusing
	useEffect(
		() => {
			const willFocusEvent = props.navigation.addListener('willFocus', loadFavProducts);
			return () => willFocusEvent.remove();
		},
		[ loadFavProducts ]
	);

	// loadFavProducts initially...
	useEffect(
		() => {
			setIsLoading(true);
			loadFavProducts();
			setIsLoading(false);
		},
		[ dispatch, loadFavProducts ]
	);

	const { navigate } = props;
	const fetchProducts = productsActions.fetchProducts();
	const selectItemHandler = useCallback(
		async (id, title) => {
			// Load all products... Other wise if logged in user visits the favorites
			// and from clicks to go to DetailesScreen,
			// the app can not find wich of the availabelProducts to show...
			await dispatch(productsActions.fetchProducts());
			props.navigation.navigate('DetailScreen', {
				productId: id,
				productTitle: title
			});
		},
		[ dispatch, fetchProducts, navigate ]
	);

	if (error) {
		return (
			<CustomLinearGradient>
			<View style={styles.centered}>
				<BoldText>
					Σφάλμα στη διαδικασία φορτώσεως των αγαπημένων προϊόντων. Παρακαλώ ελέγξτε τη σύνδεσή σας.
				</BoldText>
				{/* <Button title="Δοκιμάστε Ξανά" onPress={() => dispatch(productsActions.fetchFavProducts())} color={Colours.chocolate} /> */}
				<Button title="Δοκιμάστε Ξανά" onPress={loadFavProducts} color={Colours.chocolate} />
			</View>
			</CustomLinearGradient>
		);
	}

	if ((!!userIdExists && !isLoading && !favProducts) || favProducts.length === 0) {
		return (
			<CustomLinearGradient>
				<View style={styles.content}>
					<BoldText>Ακόμη δεν έχετε επιλέξει αγαπημένα.</BoldText>
				</View>
			</CustomLinearGradient>
		);
	}

	if ((!userIdExists && !favProducts) || favProducts.length === 0) {
		return (
			<CustomLinearGradient>
				<View style={styles.content}>
					<BoldText>Παρακαλώ συνδεθείτε ή προχωρήσθε σε εγγραφή προς χρήση των αγαπημένων.</BoldText>
					<View style={styles.buttonContainerEntrance}>
						{Platform.OS === 'android' ? (
							<View style={styles.buttonSignup}>
								<CustomButton
									title="Πιστοποίηση στοιχείων"
									color={Colours.moccasin_light}
									onPress={() => props.navigation.navigate('Auth')}
								/>
							</View>
						) : (
							<Button
								title="Πιστοποίηση στοιχείων"
								color={Colours.moccasin_light}
								onPress={() => props.navigation.navigate('Auth')}
							/>
						)}
					</View>
				</View>
			</CustomLinearGradient>
		);
	}

	if (isLoading) {
		return (
			<CustomLinearGradient>
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colours.chocolate} />
			</View>
			</CustomLinearGradient>
		);
	}

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
				<FlatList
					onRefresh={loadFavProducts}
					refreshing={isRefresing}
					data={favProducts}
					keyExtractor={(item) => item.id}
					renderItem={(itemData) => (
						<ProductItem
							title={itemData.item.title}
							image={itemData.item.imageUrl}
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

FavoritesScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Αγαπημένα',
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
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navigation.navigate({ routeName: 'Cart' })}
				/>
			</HeaderButtons>
		)
	};
};

const styles = StyleSheet.create({
	buttonContainerEntrance: {
		marginTop: 10,
		marginBottom: 10
	},
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		padding: 20
	},
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
		alignItems: 'center',
		padding: 12
	}
});

export default FavoritesScreen;
