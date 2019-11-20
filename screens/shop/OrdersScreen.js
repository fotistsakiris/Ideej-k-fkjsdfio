import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, ActivityIndicator, StyleSheet, FlatList, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomButton from '../../components/UI/CustomButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

import OrderItem from '../../components/shop/OrderItem';
import BoldText from '../../components/UI/BoldText';
import Card from '../../components/UI/Card';
import * as ordersActions from '../../store/actions/orders';
import Colours from '../../constants/Colours';

const OrdersScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isRefresing, setIsRefresing ] = useState(false);
	const dispatch = useDispatch();
	const orders = useSelector((state) => state.orders.orders);
	const userIdExists = useSelector((state) => state.auth.userId);

	const loadedOrders = useCallback(
		async () => {
			setError(null);
			setIsRefresing(true);
			setIsLoading(true);

			try {
				await dispatch(ordersActions.fetchOrders());
			} catch (err) {
				console.log(err.message);

				setError(err.message);
			}
			setIsRefresing(false);
			setIsLoading(false);
		},
		[ dispatch, setIsLoading, setError ]
	);

	// loadedOrders after focusing
	useEffect(
		() => {
			setIsLoading(true);
			const willFocusEvent = props.navigation.addListener('willFocus', loadedOrders);
			setIsLoading(false);
			return () => willFocusEvent.remove();
		},
		[ loadedOrders ]
	);

	// loadedOrders initially...
	useEffect(
		() => {
			// setIsLoading(true);
			loadedOrders();
			// setIsLoading(false);
		},
		[ dispatch, loadedOrders ]
	);

	if (error) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>
						{error.message} Σφάλμα στη διαδικασία φορτώσεως των παραγγελιών. Παρακαλούμε ελέγξτε τη σύνδεσή
						σας.
					</BoldText>
					{Platform.OS === 'android' ? (
						<CustomButton title="Δοκιμάστε Ξανά" onPress={loadedOrders} color={Colours.chocolate} />
					) : (
						<Button title="Δοκιμάστε Ξανά" onPress={loadedOrders} color={Colours.chocolate} />
					)}
				</View>
			</CustomLinearGradient>
		);
	}

	if (isLoading) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={Colours.maroon} />
				</View>
			</CustomLinearGradient>
		);
	}

	if (!userIdExists) {
		return (
			<CustomLinearGradient>
				<View style={styles.content}>
					<BoldText>
						Προκειμένου να δείτε τις παραγγελίες σας, σας Παρακαλούμε συνδεθείτε ή προχωρήσθε σε εγγραφή.
					</BoldText>
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

	if (orders.length === 0) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Δεν βρέθηκαν παραγγελίες στη βάση δεδομένων!</BoldText>
				</View>
			</CustomLinearGradient>
		);
	}

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
				<FlatList
					onRefresh={loadedOrders}
					refreshing={isRefresing}
					data={orders}
					keyExtractor={(item) => item.id}
					renderItem={(itemData) => {
						const date = new Date(itemData.item.date);
						const options = {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
							// hour: 'numeric',
							// minute: 'numeric'
						};
						return (
							<View style={styles.content}>
								<OrderItem
									totalAmount={itemData.item.totalAmount}
									date={date.toLocaleString('el-GR', options)}
									items={itemData.item.items}
								/>
							</View>
						);
					}}
				/>
			</View>
		</CustomLinearGradient>
	);
};

OrdersScreen.navigationOptions = ({ navigation }) => {
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
		margin: 12,
		padding: 12
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default OrdersScreen;
