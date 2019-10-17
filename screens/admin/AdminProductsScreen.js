import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Platform } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
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
	const editProductHandler = (id) => {
		props.navigation.navigate('EditProduct', { productId: id });
	};

	const deleteHandler = (id) => {
		Alert.alert('Διαγραφή προϊόντος!', 'Θέλετε να διαγράψετε το προϊόν;', [
			{ text: 'ΟΧΙ', style: 'default' },
			{ text: 'ΝΑΙ', style: 'destructive', onPress: () => dispatch(productsActions.deleteProduct(id)) }
		]);
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

	if (!isLoading && userProducts.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>Δεν βρέθηκαν προϊόντα στη βάση δεδομένων!</Text>
			</View>
		);
	}

	return (

		<SafeAreaView style={{flex: 1}}>
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
									<CustomButton title="Επεξεργασίαν" onPress={() => editProductHandler(itemData.item.id)} />
								</View>
								<BoldText style={styles.price}>€ {itemData.item.price}</BoldText>
								<View>
									<CustomButton title="Διαγραφήν" onPress={deleteHandler.bind(this, itemData.item.id)} />
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
								<BoldText style={styles.price}>€ {itemData.item.price}</BoldText>
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
	);
};

AdminProductsScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Τα προϊόντα σας',
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navData.navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
					onPress={() => navData.navigation.navigate('EditProduct')}
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

export default AdminProductsScreen;
