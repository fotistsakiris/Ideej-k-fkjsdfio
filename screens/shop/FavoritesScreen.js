import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';

import ProductList from '../../components/shop/ProductList';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
// import DefaultText from '../components/UI/DefaultText';

const FavoritesScreen = (props) => {
	const products = useSelector((state) => state.products.availableProducts);

	// Not needed anymore!
	// dummy data for favorite
	const favProducts = products.filter((product) => product.id === 'icon_1' || product.id === 'icon_2');
	
	// Render something when no favorites are selected.
	if (favProducts.length === 0 || !favProducts) {
		return (
			<View style={styles.content}>
				<Text>No favorite meals found.</Text>
			</View>
		);
	}

	return  <ProductList listData={favProducts} navigation={props.navigation} />;
};

FavoritesScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Αγαπημένα',
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => {
						navData.navigation.toggleDrawer();
					}}
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
		margin: 12
	}
});

export default FavoritesScreen;
