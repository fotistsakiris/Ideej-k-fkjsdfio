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
	Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomButton from '../../components/UI/CustomButton';
import ProductItem from '../../components/shop/ProductItem';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';
import * as productsActions from '../../store/actions/products';

const AdminProductsScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isRefresing, setIsRefresing ] = useState(false);

	const dispatch = useDispatch();
	const userProducts = useSelector((state) => state.products.userProducts);
	const productsInCart = useSelector((state) => state.cart.items);

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
						'Το προϊόν είναι αυτή τη στιγμή σε καλάθι πελάτη. Παρακαλώ περιμένετε να τελιώσει ο πελάτης την παραγγελία του και δοκιμάστε αργότερα. Ευχαριστώ!',
						[ { text: 'Εντάξει', style: 'default' } ]
					);
				} else {
				}
			}
		}
	};

	if (error) {
		return (
			<View style={styles.centered}>
				<BoldText>Σφάλμα στη διαδικασία φορτώσεως των προϊόντων. Παρακαλώ ελέγξτε τη σύνδεσή σας.</BoldText>
				{Platform.OS === 'android' ? (
					<CustomButton title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.chocolate} />
				) : (
					<Button title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.chocolate} />
				)}
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

	if (!isLoading && userProducts.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>Δεν βρέθηκαν προϊόντα στη βάση δεδομένων!</Text>
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<LinearGradient
				colors={[ Colours.moccasin_light, Colours.chocolate, Colours.maroon ]}
				// start={{ x: 0, y: 1 }}
				// end={{ x: 0, y: 0 }}
				style={styles.gradient}
			>
				<View style={styles.flatListContainer}>
					<SafeAreaView style={{ flex: 1 }}>
						{/* <BoldText>Εδώ ο κάθε διαχειριστής, έχει τα προϊόντα του. Προσθέσαμε ήδη τρια χάριν ευκολίας προς δοκιμασίαν της εφαρμογής.</BoldText> */}
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
										<View style={styles.actions}>
											<View>
												<CustomButton
													title="Επεξεργασίαν"
													onPress={() => editProductHandler(itemData.item.id)}
												/>
											</View>
											<BoldText style={styles.price}>
												{itemData.item.price.toFixed(2)}
												<Text style={styles.euro}> €</Text>
											</BoldText>
											<View>
												<CustomButton
													title="Διαγραφήν"
													onPress={deleteHandler.bind(this, itemData.item.id)}
												/>
											</View>
										</View>
									) : (
										<View style={styles.actions}>
											<View style={styles.button}>
												<Button
													color={Colours.gr_brown_light}
													title="Επεξεργασίαν"
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
													title="Διαγραφήν"
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
			</LinearGradient>
		</View>
	);
};

AdminProductsScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Τα προϊόντα σας',
		// For side drawer navigation only.
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navigation.toggleDrawer()}
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
	price: {
		fontSize: 18,
		color: '#888'
		// marginHorizontal: 1
	},
	euro: {
		fontSize: 14,
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

export default AdminProductsScreen;
