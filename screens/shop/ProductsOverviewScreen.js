import React from 'react';
import { View, Text, Image, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';

const ProductsOverviewScreen = (props) => {
	const categoryId = props.navigation.getParam('categoryId');
	const products = useSelector((state) =>
		state.products.availableProducts.filter((prod) => prod.categoryIds.indexOf(categoryId) >= 0)
	);
	return (
		<FlatList
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					title={itemData.item.title}
					price={itemData.item.price}
					image={itemData.item.imageUrl}
					onViewDetail={() =>
						props.navigation.navigate('DetailScreen', {
							productId: itemData.item.id,
							productTitle: itemData.item.title
						})}
					onAddToCart={() => {}}
				/>
			)}
		/>
	);
};
ProductsOverviewScreen.navigationOptions = (navData) => {
	return {
		headerTitle: navData.navigation.getParam('categoryTitle')
	};
};

export default ProductsOverviewScreen;
