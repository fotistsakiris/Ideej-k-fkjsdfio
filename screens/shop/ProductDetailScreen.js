import React from 'react';
import { Platform, View, Text, ScrollView, Image, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import PRODUCTS from '../../data/products';
import CustomButton from '../../components/UI/CustomButton';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';

import Colours from '../../constants/Colours';
import { Icon } from 'react-native-elements';

const ProductDetailScreen = (props) => {
	const dispatch = useDispatch();

	const productId = props.navigation.getParam('productId');
	const selectedProduct = PRODUCTS.find((prod) => prod.id === productId);
	return (
		<ScrollView>
			<View style={styles.icon}>
				<Icon
					size={18}
					name={true ? 'favorite' : 'favorite_bord'}
					type="material"
					color={Colours.chocolate}
					onPress={() => dispatch(productActions.toggleFavorite(productId))}
				/>
			</View>
			<Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
			{Platform.OS === 'android' ? (
				<View style={styles.button}>
					<CustomButton
						title="Προσθήκη στο καλάθι"
						onPress={() => dispatch(cartActions.addToCard(selectedProduct))}
					/>
				</View>
			) : (
				<View style={styles.button}>
					<Button
						color={Colours.gr_brown_light}
						title="Προσθήκη στο καλάθι"
						onPress={() => dispatch(cartActions.addToCard(selectedProduct))}
					/>
				</View>
			)}

			<Text style={styles.price}>€ {selectedProduct.price.toFixed(2)}</Text>
			<Text style={styles.description}>{selectedProduct.description}</Text>
		</ScrollView>
	);
};

ProductDetailScreen.navigationOptions = (navData) => {
	return {
		headerTitle: navData.navigation.getParam('productTitle')
	};
};

const styles = StyleSheet.create({
	icon: {
		alignSelf: 'center',
		margin: 2
	},
	image: {
		width: '100%',
		height: 300,
		resizeMode: 'contain',
		margin: 2
	},
	price: {
		fontSize: 18,
		color: '#888',
		textAlign: 'center',
		marginVertical: 20
	},
	description: {
		fontSize: 20,
		textAlign: 'justify',
		padding: 20
	},
	button: {
		marginHorizontal: 5,
		alignSelf: 'center'
	}
});

export default ProductDetailScreen;
