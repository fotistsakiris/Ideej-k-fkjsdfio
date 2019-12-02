import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	Text,
	SafeAreaView,
	Alert,
	FlatList,
	Button,
	StyleSheet,
	ActivityIndicator,
	Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomButton from '../../components/UI/CustomButton';
import CartItem from '../../components/game/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/choices';
import Card from '../../components/UI/Card';
import Colours from '../../constants/Colours';
import BoldText from '../../components/UI/BoldText';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
const CartScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState();
	const dispatch = useDispatch();
	const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
	const userIdExists = useSelector((state) => state.auth.userId);

	const cartItems = useSelector((state) => {
		// TRANSFORM AN OBJECT INTO AN ARRAY
		const transformedCartItems = [];
		for (const key in state.cart.items) {
			const index = state.cart.items[key].index;
			// Use splice to keep the choice when adding/subtracting
			transformedCartItems.splice(index, 0, {
				id: key,
				index: state.cart.items[key].index,
				title: state.cart.items[key].title,
				difficultyLevel: state.cart.items[key].difficultyLevel,
				quantity: state.cart.items[key].quantity,
				sum: state.cart.items[key].sum
			});
		}
		// return transformedCartItems.sort((a, b) => (a.questionId > b.questionId ? 1 : -1));
		return transformedCartItems;
	});

	const sendOrderHandler = async () => {
		setError(null);
		setIsLoading(true);
		try {
			// Note on the server, 1 cartItems is 0, 2 = 1 etc...
			if (!userIdExists) {
				Alert.alert(
					'Ευχαριστούμε για την προτίμησή σας.',
					'Σας Παρακαλούμε συνδεθείτε ή δημιουργήστε ένα λογαριασμό, προκειμένου να προχωρήσετε με τις επιλογές σας. Ευχαριστούμε! ',
					[ { text: 'Εντάξει', style: 'default' } ]
				);
			} else {
				await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
			}
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
		if (!userIdExists) {
			props.navigation.navigate('Auth');
		} else {
			props.navigation.navigate('Orders');
		}
	};

	if (error) {
		return (
			<View style={styles.centered}>
				<BoldText>
					Σφάλμα στη διαδικασία αποθηκεύσεως των επιλογών σας. Παρακαλούμε ελέγξτε τη σύνδεσή σας.
				</BoldText>
				{Platform.OS === 'android' ? (
					<CustomButton
						title="Δοκιμάστε Ξανά"
						onPress={() => dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))}
						color={Colours.maroon}
					/>
				) : (
					<Button
						title="Δοκιμάστε Ξανά"
						onPress={() => dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))}
						color={Colours.maroon}
					/>
				)}
			</View>
		);
	}
	const renderCardItem = (itemData) => {
		return (
			<Card style={styles.summary}>
				<CartItem
					quantity={itemData.item.quantity}
					difficultyLevel={itemData.item.difficultyLevel}
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
		);
	};

	// NOTE: cartItems is an array!!! (Because of the FlatList down below)
	if (cartItems.length === 0) {
		return (
			<CustomLinearGradient>
				<Card style={styles.summary}>
					<BoldText style={styles.centered}>Δεν έχετε δημιουργήσει συλλογές ακόμη</BoldText>
				</Card>
			</CustomLinearGradient>
		);
	}

	if (isLoading) {
		return (
			<CustomLinearGradient>
				<ActivityIndicator size="large" color={Colours.moccasin_light} />
			</CustomLinearGradient>
		);
	}

	return (
		<CustomLinearGradient>
			<Card style={styles.summary}>
				<BoldText style={styles.summaryText}>
					{/* Use Math.round etc to remove the -0... */}
					Τελικό Σύνολο: {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
					<Text style={styles.euro}> €</Text>
				</BoldText>
				{Platform.OS === 'android' ? (
					<CustomButton
						// color={cartItems.length === 0 ? 'gray' : ''}
						style={styles.customButton}
						textStyle={styles.buttonText}
						title="Εκτέλεση επιλογών"
						disabled={cartItems.length === 0}
						onPress={sendOrderHandler}
					/>
				) : (
					<Button
						color={Colours.maroon}
						title="Εκτέλεση επιλογών"
						disabled={cartItems.length === 0}
						onPress={sendOrderHandler}
					/>
				)}
			</Card>
			<SafeAreaView style={styles.flatListContainer}>
				<FlatList
					contentContainerStyle={styles.flatListStyle}
					data={cartItems}
					keyExtractor={(item) => item.id}
					renderItem={renderCardItem}
				/>
			</SafeAreaView>
		</CustomLinearGradient>
	);
};

CartScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Οι επιλογές σας'
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
		// 			iconName='adchoices'
		// 			onPress={() => navigation.navigate({routeName: 'Cart'})}
		// 		/>
		// 	</HeaderButtons>
		// )
	};
};

const styles = StyleSheet.create({
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	flatListStyle: {
		paddingBottom: 50
	},
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		margin: 10,
		padding: 10
	},
	amound: {
		maxWidth: '90%'
	},
	euro: {
		fontSize: 14,
		color: '#888'
	},
	customButton: {
		width: '40%',
		height: 50
	},
	buttonText: {
		paddingLeft: 7
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default CartScreen;
