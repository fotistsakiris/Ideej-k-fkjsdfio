import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	Text,
	Button,
	FlatList,
	StyleSheet,
	SafeAreaView,
	Alert,
	ActivityIndicator,
	Platform,
	Dimensions
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomButton from '../../components/UI/CustomButton';
import ProductItem from '../../components/shop/ProductItem';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
import * as productsActions from '../../store/actions/products';

const AdminProductsOverview = (props) => {
	const width = Dimensions.get('window').width; // for putting the buttons in column for small screens

	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isRefresing, setIsRefresing ] = useState(false);

	const dispatch = useDispatch();
	// const userProducts = useSelector((state) => state.products.userProducts);
	const productsInCart = useSelector((state) => state.cart.items);

	const AdminCategoryId = props.navigation.getParam('AdminCategoryId');
	const userProducts = useSelector((state) =>
		state.products.userProducts.filter((prod) => prod.categoryIds.indexOf(AdminCategoryId) >= 0)
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
			loadProducts().then(() => setIsLoading(false));
		},
		[ dispatch, loadProducts ]
	);
	const editProductHandler = (id) => {
		props.navigation.navigate('EditProduct', { productId: id });
	};

	const deleteHandler = (id) => {
		if (Object.keys(productsInCart).length === 0) {
			Alert.alert('Διαγραφή προϊόντος!', 'Θέλετε να διαγράψετε το προϊόν;', [
				{ text: 'ΟΧΙ', style: 'default' },
				{ text: 'ΝΑΙ', style: 'destructive', onPress: () => dispatch(productsActions.deleteProduct(id)) }
			]);
		} else {
			for (const key in productsInCart) {
				if (key === id) {
					Alert.alert(
						'Διαγραφή προϊόντος!',
						'Το προϊόν είναι αυτή τη στιγμή σε καλάθι πελάτη. Παρακαλούμε περιμένετε να τελιώσει ο πελάτης την παραγγελία του και δοκιμάστε αργότερα. Ευχαριστούμε!',
						[ { text: 'Εντάξει', style: 'default' } ]
					);
				} else {
				}
			}
		}
	};

	if (error) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Σφάλμα στη διαδικασία φορτώσεως των προϊόντων. Παρακαλούμε ελέγξτε τη σύνδεσή σας.</BoldText>
					{Platform.OS === 'android' ? (
						<CustomButton title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.moccasin_light} />
					) : (
						<Button title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.moccasin_light} />
					)}
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

	if (!isLoading && userProducts.length === 0) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Δεν βρέθηκαν προϊόντα στη βάση δεδομένων!</BoldText>
					{Platform.OS === 'android' ? (
						<CustomButton
							title="Διαχειριστής"
							onPress={() => props.navigation.navigate('AdminCategories')}
							color={Colours.moccasin_light}
						/>
					) : (
						<Button
							title="Διαχειριστής"
							onPress={() => props.navigation.navigate('AdminCategories')}
							color={Colours.moccasin_light}
						/>
					)}
				</View>
			</CustomLinearGradient>
		);
	}

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
				<SafeAreaView style={{ flex: 1 }}>
					<FlatList
						onRefresh={loadProducts}
						refreshing={isRefresing}
						data={userProducts}
						keyExtractor={(item) => item.id}
						renderItem={(itemData) => (
							<ProductItem
								image={itemData.item.imageUrl}
								title={itemData.item.title}
								onSelect={() => editProductHandler(itemData.item.id)}
							>
								{Platform.OS === 'android' ? (
								<View style={width < 400 ? styles.actionsSmall : styles.actions}>
									<View style={styles.customButton}>
											<CustomButton
												title="Επεξεργασία"
												onPress={() => editProductHandler(itemData.item.id)}
											/>
										</View>
										<BoldText style={styles.price}>
											{itemData.item.price.toFixed(2)}
											<Text style={styles.euro}> €</Text>
										</BoldText>
										<View style={styles.customButton}>
											<CustomButton
												title="Διαγραφή"
												onPress={deleteHandler.bind(this, itemData.item.id)}
											/>
										</View>
									</View>
								) : (
									<View style={styles.actions}>
										<View style={styles.button}>
											<Button
												color={Colours.gr_brown_light}
												title="Επεξεργασία"
												onPress={() => editProductHandler(itemData.item.id)}
											/>
										</View>
										<BoldText style={styles.price}>
											{itemData.item.price.toFixed(2)}
											<Text style={styles.euro}> €</Text>
										</BoldText>
										{/* <BoldText style={styles.price}>€ {itemData.item.price}</BoldText> */}
										<View style={styles.button}>
											<Button
												color={Colours.gr_brown_light}
												title="Διαγραφή"
												onPress={() => dispatch(deleteHandler.bind(this, itemData.item.id))}
											/>
										</View>
									</View>
								)}
								{/* <Button color={Colours.maroon} title="Edit" onPress={() => editProductHandler(itemData.item.id)} />
					<Button
						color={Colours.maroon}
						title="Delete"
						onPress={deleteHandler.bind(this, itemData.item.id)}
					/> */}
							</ProductItem>
						)}
					/>
				</SafeAreaView>
			</View>
		</CustomLinearGradient>
	);
};

AdminProductsOverview.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('AdminCategoryTitle'),
		// headerTitle: 'Τα προϊόντα σας',
		// For side drawer navigation only.
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="card"
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
					title="create"
					iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
					onPress={() => navigation.navigate('EditProduct')}
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
		width: '50%'
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default AdminProductsOverview;
