import React from 'react';
import { Text, View, FlatList, StyleSheet, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';

// import DefaultText from '../components/UI/DefaultText';

const FavoritesScreen = (props) => {
	const dispatch = useDispatch();

	// const products = useSelector((state) => state.products.availableProducts);
	const favProducts = useSelector((state) => state.products.favoriteProducts);

	// // Not needed anymore!
	// // dummy data for favorite
	// const favProducts = products.filter((product) => product.id === 'icon_1' || product.id === 'icon_2');
 
	// Render something when no favorites are selected.
	if (favProducts.length === 0 || !favProducts) {
		return (
			<View style={styles.content}>
				<Text>No favorite meals found.</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={favProducts}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					title={itemData.item.title}
					price={itemData.item.price}
					image={itemData.item.imageUrl}
					onToggleFavorite={() => dispatch(productActions.toggleFavorite(itemData.item.id))}
					onViewDetail={() =>
						props.navigation.navigate('DetailScreen', {
							productId: itemData.item.id,
							productTitle: itemData.item.title
						})}
					onAddToCart={() => dispatch(cartActions.addToCard(itemData.item))}
				/>
			)}
		/>
	);
};

FavoritesScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Αγαπημένα',
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="Menu"
		// 			iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
		// 			onPress={() => {
		// 				navData.navigation.toggleDrawer();
		// 			}}
		// 		/>
		// 	</HeaderButtons>
		// ),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navData.navigation.navigate({routeName: 'Cart'})}
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

export default FavoritesScreen;
