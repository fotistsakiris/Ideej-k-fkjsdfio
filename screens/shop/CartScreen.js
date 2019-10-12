import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
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
			// A cart-item with an additional productId prop.
			transformedCartItems.push({
				productId: key,
				productTitle: state.cart.items[key].productTitle,
				productPrice: state.cart.items[key].productPrice,
				quantity: state.cart.items[key].quantity,
				sum: state.cart.items[key].sum
			});
		}
		return transformedCartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1));
	});

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
		// props.navigation.navigate('Orders');
	};


	if (error) {
		return (
			<View style={styles.centered}>
				<BoldText>Σφάλμα στη διαδικασία αποστολής της παραγγελίας. Παρακαλώ ελέγξτε τη σύνδεσή σας.</BoldText>
				<Button title="Δοκιμάστε Ξανά" 
				onPress={() => dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))} color={Colours.chocolate} />
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<View style={styles.summary}>
				<BoldText style={styles.summaryText}>
					{/* Use Math.round etc to remove the -0... */}
					Σύνολο:{' '}
					<BoldText style={styles.amount}>{Math.round(cartTotalAmount.toFixed(2) * 100) / 100} €</BoldText>
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
			</View>
			<FlatList
				data={cartItems}
				keyExtractor={(item) => item.productId}
				renderItem={(itemData) => (
					<CartItem
						quantity={itemData.item.quantity}
						title={itemData.item.productTitle}
						amount={itemData.item.sum}
						deletable // Needed to show the delete button.
						onRemove={() => dispatch(cartActions.removeFromCart(itemData.item.productId))}
					/>
				)}
			/>
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
		margin: 20
	},
	summary: {
		shadowColor: 'black',
		shadowOpacity: 0.26,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
		borderRadius: 10,
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
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
