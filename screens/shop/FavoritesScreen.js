import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';

import ProductList from '../../components/shop/ProductList';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
// import DefaultText from '../components/UI/DefaultText';

const FavoritesScreen = (props) => {
	// `meals` is the reducer identifier (see in App.js)
	const favProducts = useSelector((state) => state.products.favoriteMeals);

	// Not needed anymore!
	// dummy data for favorite
	// const favProducts = favProducts.filter((meal) => meal.id === 'm1' || meal.id === 'm2');
	// Alternative:
	// const favProducts = MEALS.filter((meal) => meal.affordability === 'affordable');

	// Render something when no favorites are selected.
	if (favProducts.length === 0 || !favProducts) {
		return (
			<View style={styles.content}>
				<DefaultText>No favorite meals found.</DefaultText>
			</View>
		);
	}

	return <ProductList listData={favProducts} navigation={props.navigation} />;
};

FavoritesScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Favorites',
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Menu"
					iconName="menu"
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
		alignItems: 'center'
	}
});

export default FavoritesScreen;
