import React from 'react';
import { Text, View, Button, FlatList, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';

import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';

// import DefaultText from '../components/UI/DefaultText';

const FavoritesScreen = (props) => {
	const dispatch = useDispatch();
	const favProducts = useSelector((state) => state.products.favoriteProducts);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate('DetailScreen', {
			productId: id,
			productTitle: title
		})
	} 
	// Render something when no favorites are selected.
	if (favProducts.length === 0 || !favProducts) {
		return (
			<View style={styles.content}>
				<BoldText
				>{`Ακόμη δεν έχετε επιλέξει αγαπημένα. \nΠαρακαλώ κάντε τις επιλογές σας.\nΘα χαρούμε να σας εξυπηρετήσουμε!`}</BoldText>
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
					image={itemData.item.imageUrl}
					onToggleFavorite={() => dispatch(productActions.toggleFavorite(itemData.item.id))}
					onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}
				>
					{Platform.OS === 'android' ? (
						<View style={styles.actions}>
							<View>
								<CustomButton
									title="Λεπτομέρειες"
									onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
								/>
							</View>
							<BoldText style={styles.price}>€ {itemData.item.price}</BoldText>
							<View>
								<CustomButton
									title="... στο καλάθι"
									onPress={() => dispatch(cartActions.addToCard(itemData.item))}
								/>
							</View>
						</View>
					) : (
						<View style={styles.actions}>
							<View style={styles.button}>
								<Button
									color={Colours.gr_brown_light}
									title="Λεπτομέρειες"
									onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
								/>
							</View>
							<BoldText style={styles.price}>€ {itemData.item.price}</BoldText>
							<View style={styles.button}>
								<Button
									color={Colours.gr_brown_light}
									title="... στο καλάθι"
									onPress={() => dispatch(cartActions.addToCard(itemData.item))}
								/>
							</View>
						</View>
					)}
				</ProductItem>
			)}
		/>
	);
};

FavoritesScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Αγαπημένα',
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="goBack"
		// 			iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
		// 			onPress={() => navigation.pop()}
		// 		/>
		// 	</HeaderButtons>
		// ),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="card"
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navigation.navigate({ routeName: 'Cart' })}
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
	},
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

export default FavoritesScreen;
