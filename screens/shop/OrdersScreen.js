import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, StyleSheet, FlatList, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import BoldText from '../../components/UI/BoldText';
import * as ordersActions from '../../store/actions/orders';
import Colours from '../../constants/Colours';


const OrdersScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isRefresing, setIsRefresing ] = useState(false);
	const dispatch = useDispatch();
	const orders = useSelector((state) => state.orders.orders);

	const loadedOrders = useCallback(
		async () => {
			setError(null);
			setIsRefresing(true);
			try {
				await dispatch(ordersActions.fetchOrders());
			} catch (err) {
				console.log((err.message));
				
				setError(err.message);
			}
			setIsRefresing(false);
		},
		[ dispatch, setIsLoading, setError ]
	);

	// loadedOrders after focusing
	useEffect(
		() => {
			const willFocusEvent = props.navigation.addListener('willFocus', loadedOrders);
			return () => willFocusEvent.remove();
		},
		[ loadedOrders ]
	);

	// loadedOrders initially...
	useEffect(
		() => {
			setIsLoading(true);
			loadedOrders(); 
			setIsLoading(false);
		},
		[ dispatch, loadedOrders ]
	);

	if (error) {
		return (
			<View style={styles.centered}>
				<BoldText>{error.message}Σφάλμα στη διαδικασία φορτώσεως των παραγγελιών. Παρακαλώ ελέγξτε τη σύνδεσή σας.</BoldText>
				<Button title="Δοκιμάστε Ξανά" onPress={loadedOrders} color={Colours.chocolate} />
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

	if (!isLoading && orders.length === 0) {
		return (
			<View style={styles.centered}>
				<BoldText>Δεν βρέθηκαν παραγγελίες στη βάση δεδομένων!</BoldText>
			</View>
		);
	}
	
	return (
		<FlatList
			onRefresh={loadedOrders}
			refreshing={isRefresing}
			data={orders}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => {
				return (
					<OrderItem
						totalAmount={itemData.item.totalAmount}
						date={itemData.item.readableDate}
						items={itemData.item.items}
					/>
				);
			}}
		/>
	);
};

OrdersScreen.navigationOptions = ({navigation}) => {
	return {
		headerTitle: 'Οι παραγγελίες σας',
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
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default OrdersScreen;
