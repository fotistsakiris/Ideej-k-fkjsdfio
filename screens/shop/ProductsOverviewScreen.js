import React from 'react';
import { View, Text, Image, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';

const ProductsOverviewScreen = (props) => {
	const products = useSelector((state) => state.products.availableProducts);
	return (
		<FlatList
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					title={itemData.item.title}
					price={itemData.item.price}
					image={itemData.item.imageUrl}
					onViewDetail={() => {}}
					onAddToCart={() => {}}
				/>
			)}
		/>
	);
};
ProductsOverviewScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Εκκλησιαστικά είδη'
	};
};

export default ProductsOverviewScreen;
