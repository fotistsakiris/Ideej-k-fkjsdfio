import React from 'react';
import { FlatList, View, Text, Button, StyleSheet, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colours from '../../constants/Colours';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = (props) => {
	const dispatch = useDispatch();
	const userProducts = useSelector((state) => state.products.userProducts);

	const editProductHandler = (id) => {
		props.navigation.navigate('EditProduct', { productId: id });
	};

	const deleteHandler = (id) => {
		Alert.alert('Delete product!', 'Are you sure you want to delete this product?', [
			{ text: 'NO', style: 'default' },
			{ text: 'YES', style: 'destructive', onPress: () => dispatch(productsActions.deleteProduct(id)) }
		]);
	};
	return (
		<FlatList
			data={userProducts}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => editProductHandler(itemData.item.id)}
				>
                    {Platform.OS === 'android' ? (
							<View style={styles.actions}>
								<View>
									<CustomButton title="Επεξεργασία" onPress={() => editProductHandler(itemData.item.id)} />
								</View>
								<BoldText style={styles.price}>€ {props.price.toFixed(2)}</BoldText>
								<View>
									<CustomButton title="Διαγραφή" onPress={deleteHandler.bind(this, itemData.item.id)} />
								</View>
							</View>
						) : (
							<View style={styles.actions}>
								<View style={styles.button}>
									<Button
										color={Colours.gr_brown_light}
										title="Επεξεργασία"
										onPress={() => editProductHandler(itemData.item.id)}
									/>
								</View>
								<Text style={styles.price}>€ {props.price.toFixed(2)}</Text>
								<View style={styles.button}>
									<Button
										color={Colours.gr_brown_light}
										title="Διαγραφή"
										onPress={() => dispatch(deleteHandler.bind(this, itemData.item.id))}
									/>
								</View>
							</View>
						)}
					{/* <Button color={Colours.maroon} title="Edit" onPress={() => editProductHandler(itemData.item.id)} />
					<Button
						color={Colours.maroon}
						title="Delete"
						onPress={deleteHandler.bind(this, itemData.item.id)}
					/> */}
				</ProductItem>
			)}
		/>
	);
};

UserProductsScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Τα προϊόντα σας',
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navData.navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
					onPress={() => navData.navigation.navigate('EditProduct')}
				/>
			</HeaderButtons>
		)
	};
};

const styles = StyleSheet.create({
	price: {
		fontSize: 18,
		color: '#888'
	},
	actions: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		height: '18%',
		paddingHorizontal: 20
	},
	button: {
		width: '50%'
	}
});

export default UserProductsScreen;
