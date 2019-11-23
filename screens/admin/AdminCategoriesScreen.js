import React from 'react';
import { FlatList, View, Button, Alert, Platform, StyleSheet } from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { CATEGORIES } from '../../data/categories';
import CategoryGridTile from '../../components/shop/CategoryGridTile';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
import Colours from '../../constants/Colours';

const AdminCategoriesScreen = (props) => {
	const renderGridItem = (itemData) => {
		return (
			<CategoryGridTile
				color={itemData.item.color}
				title={itemData.item.title}
				onSelect={() => {
					props.navigation.navigate({
						routeName: 'AdminProducts',
						params: {
							AdminCategoryId: itemData.item.id,
							AdminCategoryTitle: itemData.item.title
						}
					});
				}}
			/>
		);
	};
	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
			{Platform.OS === 'android' ? (
						<CustomButton
							title="Έκθεση"
							onPress={() => props.navigation.navigate('Ekthesis')}
							color={Colours.maroon}
						/>
					) : (
						<Button
							title="Έκθεση"
							onPress={() => props.navigation.navigate('Ekthesis')}
							color={Colours.maroon}
						/>
					)}
				<FlatList
					numColumns={2}
					keyExtractor={(item, index) => item.id}
					data={CATEGORIES}
					renderItem={renderGridItem}
				/>
			</View>
		</CustomLinearGradient>
	);
};

AdminCategoriesScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Τα προϊόντα σας',
		// Needed for side drawer navigation
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					onPress={() => {
						Alert.alert(`Κατηγορίες προϊόντων`,
					   `Εικόνες - Αγιογραφίες: c1\nΕργόχειρα: c2\nΜοναστηριακά προϊόντα.: c3\nΕκκλησιαστικά Είδη: c4\nΟρθόδοξη Βιβλιοθήκη.: c5\nΕίδη δώρων - Αναμνηστικά.: c6\nΠροτεινόμενα προϊόντα: c7\n`, [
							{ text: 'Εντάξη', style: 'default' },
						]);
					}}
					title="categories"
					iconName={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
					size={23}
				/>
			</HeaderButtons>
		),
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="goBack"
					iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
					onPress={() => navigation.navigate('Categories')}
				/>
			</HeaderButtons>
		),
		// headerRight: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="cart"
		// 			iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
		// 			onPress={() => navigation.navigate({ routeName: 'Cart' })}
		// 		/>
		// 	</HeaderButtons>
		// )
	};
};

const styles = StyleSheet.create({
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		padding: 20
	}
});

export default AdminCategoriesScreen;
