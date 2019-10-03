import React from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import BoldText from '../../components/UI/BoldText';

const OrdersScreen = (props) => {
	const orders = useSelector((state) => state.orders.orders);

	// Render something when no orders are placed.
	if (orders.length === 0 || !orders) {
		return (
			<View style={styles.content}>
				<BoldText>{`Ακόμη δεν έχετε δημιουργήσει παραγγελίες. \nΠαρακαλώ κάντε τις επιλογές σας.\nΘα χαρούμε να σας εξυπηρετήσουμε!`}</BoldText>
			</View>
		);
	}
	return (
		<FlatList
			data={orders}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => {
				return (
					<OrderItem
						amount={itemData.item.totalAmount}
						date={itemData.item.readableDate}
						items={itemData.item.items} // for the OrderItem
					/>
				);
			}}
		/>
	);
};

OrdersScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Οι παραγγελίες σας',
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="menu"
		// 			iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
		// 			onPress={() => navData.navigation.toggleDrawer()}
		// 		/>
		// 	</HeaderButtons>
		// )
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navData.navigation.navigate({ routeName: 'Cart' })}
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
	}
});

export default OrdersScreen;
