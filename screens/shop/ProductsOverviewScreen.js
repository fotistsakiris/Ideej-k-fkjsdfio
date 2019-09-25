import React from 'react';
import { View, Text, Image, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const ProductsOverviewScreen = (props) => {
	const products = useSelector((state) => state.products.availableProducts);
	return (
		<FlatList
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => <Text>{itemData.item.title}</Text>}
		/>
	);
};

const styles = StyleSheet.create({});

export default ProductsOverviewScreen;
