import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';
import Card from '../../components/UI/Card';
import Colours from '../../constants/Colours';
import BoldText from '../../components/UI/BoldText';

const CartScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState();
	const dispatch = useDispatch();
	const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

	const cartItems = useSelector((state) => {
		// TRANSFORM AN OBJECT INTO AN ARRAY

		const transformedCartItems = [];
		for (const key in state.cart.items) {
			// const index = state.cart.items[key].index;
			const index = state.cart.items[key].index;
			console.log('index', index);
			// A cart-item with an additional productId prop.
			// Use splice to keep the order when adding/subtracting
			transformedCartItems.splice(index, 0, {
				id: key, 
				index: state.cart.items[key].index,
				title: state.cart.items[key].title,
				price: state.cart.items[key].price,
				quantity: state.cart.items[key].quantity,
				sum: state.cart.items[key].sum
			});
		}
		// return transformedCartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1));
		return transformedCartItems;
	});

	// const cartItems = useSelector((state) => {
	// 	// TRANSFORM AN OBJECT INTO AN ARRAY
	// 	const transformedCartItems = [];
	// 	for (const key in state.cart.items) {
	// 		// A cart-item with an additional productId prop.
	// 		transformedCartItems.push({
	// 			id: key,
	// 			title: state.cart.items[key].title,
	// 			price: state.cart.items[key].price,
	// 			quantity: state.cart.items[key].quantity,
	// 			sum: state.cart.items[key].sum
	// 		});
	// 	}
	// 	// return transformedCartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1));
	// 	return transformedCartItems.sort((a, b) => (a.title - b.title));
	// });

	const sendOrderHandler = async () => {
		setError(null);
		setIsLoading(true);
		try {
			// Note on the server, 1 cartItems is 0, 2 = 1 etc...
			await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
		props.navigation.navigate('Orders');
	};

	if (error) {
		return (
			<View style={styles.centered}>
				<BoldText>Σφάλμα στη διαδικασία αποστολής της παραγγελίας. Παρακαλώ ελέγξτε τη σύνδεσή σας.</BoldText>
				<Button
					title="Δοκιμάστε Ξανά"
					onPress={() => dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))}
					color={Colours.chocolate}
				/>
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<LinearGradient
				colors={[ Colours.lightseagreen, Colours.chocolate, Colours.maroon ]}
				start={{ x: 0, y: 1 }}
				end={{ x: 0, y: 0 }}
				style={styles.gradient}
			>
				<View style={styles.flatListContainer}>
					<Card style={styles.summary}>
						<BoldText style={styles.summaryText}>
							{/* Use Math.round etc to remove the -0... */}
							Σύνολο:{' '}
							<BoldText style={styles.amount}>
								{Math.round(cartTotalAmount.toFixed(2) * 100) / 100} €
							</BoldText>
						</BoldText>
						{/* NOTE: cartItems is an array!!! (Because of the FlatList down below) */}
						{isLoading ? (
							<ActivityIndicator size="large" color={Colours.chocolate} />
						) : (
							<Button
								color={Colours.chocolate}
								title="Εκτέλεση παραγγελίας"
								disabled={cartItems.length === 0}
								onPress={sendOrderHandler}
							/>
						)}
					</Card>
					<View style={styles.screen}>
						<LinearGradient
							colors={[ Colours.lightseagreen, Colours.chocolate, Colours.maroon ]}
							// start={{ x: 0, y: 1 }}
							// end={{ x: 0, y: 0 }}
							style={styles.gradient}
						>
							<View style={styles.flatListContainer}>
								<FlatList
									data={cartItems}
									keyExtractor={(item) => item.id}
									renderItem={(itemData) => (
										<Card style={styles.summary}>
											<CartItem
												quantity={itemData.item.quantity}
												price={itemData.item.price}
												title={itemData.item.title}
												amount={itemData.item.sum}
												changeQuantity // Needed to show the plus/minus buttons.
												onAddProduct={() => {
													dispatch(cartActions.addToCard(itemData.item));
												}}
												onRemoveProduct={() => {
													dispatch(cartActions.removeFromCart(itemData.item.id));
												}}

												// onRemoveAll={() => dispatch(cartActions.removeFromCart(itemData.item.id))}
											/>
										</Card>
									)}
								/>
							</View>
						</LinearGradient>
					</View>
				</View>
			</LinearGradient>
		</View>
	);
};

CartScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Το καλάθι σας'
		// headerRight: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="goBack"
		// 			iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
		// 			onPress={() => navigation.pop()}
		// 		/>
		// 	</HeaderButtons>
		// ),
		// headerRight: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="card"
		// 			iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
		// 			onPress={() => navigation.navigate({routeName: 'Cart'})}
		// 		/>
		// 	</HeaderButtons>
		// )
	};
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		// margin: 20,
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
		maxHeight: '100%'
		// padding: 20
	},
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		margin: 10,
		padding: 10
	},
	summaryText: {
		fontSize: 18,
		color: Colours.chocolate
	},
	amount: {
		color: Colours.chocolate
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default CartScreen;
