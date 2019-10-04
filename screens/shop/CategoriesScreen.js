// Here you can select the thema/category of the books,
// e.g. Biblical, Dogmatic, History etc

import React from 'react';
import { FlatList, Platform } from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { CATEGORIES } from '../../data/categories';
import CategoryGridTile from '../../components/shop/CategoryGridTile';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';

const CategoriesScreen = (props) => {
	const renderGridItem = (itemData) => {
		return (
			<CategoryGridTile
				color={itemData.item.color}
				title={itemData.item.title}
				onSelect={() => {
					props.navigation.navigate({
						routeName: 'ProductsOverview',
						params: {
							categoryId: itemData.item.id,
							categoryTitle: itemData.item.title
						}
					});
				}}
			/>
		);
	};
	return (
		<FlatList
			numColumns={2}
			keyExtractor={(item, index) => item.id}
			data={CATEGORIES}
			renderItem={renderGridItem}
		/>
	);
};

CategoriesScreen.navigationOptions = (navData) => {
	return {
		headerTitle: '\`Εκθεσις',
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			onPress={() => navData.navigation.toggleDrawer()}
		// 			title="Menu"
		// 			iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
		// 			size={23}
		// 		/>
		// 	</HeaderButtons>
		// )
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

export default CategoriesScreen;
