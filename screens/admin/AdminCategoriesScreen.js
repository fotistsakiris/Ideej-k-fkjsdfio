import React from 'react';
import { FlatList, View, Button, Alert, Platform, StyleSheet } from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { CATEGORIES } from '../../data/categories';
import CategoryGridTile from '../../components/game/CategoryGridTile';
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
						title="ΕΝ ΤΟΥΤΩ ΝΙΚΑ"
						onPress={() => props.navigation.navigate('en_touto_nika')}
						color={Colours.maroon}
					/>
				) : (
					<Button
						title="ΕΝ ΤΟΥΤΩ ΝΙΚΑ"
						onPress={() => props.navigation.navigate('en_touto_nika')}
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
		headerTitle: 'Κατηγορίες Διαχειριστή',
		// Needed for side drawer navigation
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					onPress={() => {
						Alert.alert(
							`Κατηγορίες ερωτήσεων`,
							`Καινή Διαθήκη: 1\nΠαλαιά Διαθήκη: 2\nΑγιολγία: 3\nΛειτουργική: 4\nΕκκλησιαστική Ιστορία: 5\nΔογματική: 6\nΙεροί Κανόνες: 7\nΑντιαιρετικά: 8\n`,
							[ { text: 'Εντάξει', style: 'default' } ]
						);
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
		)
		// headerRight: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="cart"
		// 			iconName='adchoices'
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
