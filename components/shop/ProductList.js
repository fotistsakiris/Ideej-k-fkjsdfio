import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import ProductItem from './ProductItem';

// Is getting used in FavoritesScreen
/////// Is getting used in CategoryMealsScreen and in FavoritesScreen
const ProductList = (props) => {
	const favoriteProducts = useSelector((state) => state.products.favoriteProducts);
	
    const renderProductItem = (itemData) => {
		// For changing the favorite icon.
		// When we get a single item, we check if it's a favorite
		const isFavorite = favoriteProducts.some(product => product.id === itemData.item.id);
		
		// DON'T FORGET RETURN
		return (
			<ProductItem
				title={itemData.item.title}
				image={itemData.item.imageUrl}
				price={itemData.item.price}
				onViewDetail={itemData.item.onViewDetail}
				onAddToCard={itemData.item.onAddToCard}
				// onSelectMeal={() => {
                //     //  We have a `navigation` prop because we forwarded it in CategoryMealsScreen.
				// 	props.navigation.navigate({ routeName: 'MealDetail', 
				// 	params: { 
				// 		mealId: itemData.item.id,
				// 		mealTitle: itemData.item.title,
				// 		isFav: isFavorite
				// 	} });
				// }}
			/>
		);
    };
	return (
		<View style={styles.list}>
			<FlatList
				data={props.listData}
				keyExtractor={(item, index) => item.id} // Modern versions of RN automatically detect the key. Thus, keyExtractor is not needed!
				renderItem={renderProductItem}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	list: {
		flex: 1,
		justifyContent: 'center',
        alignItems: 'center',
        padding: 10
	}
});

export default ProductList;
