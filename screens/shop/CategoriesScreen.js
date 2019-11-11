import React from 'react';
import { FlatList, View, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { CATEGORIES } from '../../data/categories';
import CategoryGridTile from '../../components/shop/CategoryGridTile';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';

import Colours from '../../constants/Colours';

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
		<View style={styles.screen}>
			<LinearGradient
				colors={[ Colours.moccasin_light, Colours.chocolate, Colours.maroon ]}
				// start={{ x: 0, y: 1 }}
				// end={{ x: 0, y: 0 }}
				style={styles.gradient}
			>
				<View style={styles.flatListContainer}>
					<FlatList
						numColumns={2}
						keyExtractor={(item, index) => item.id}
						data={CATEGORIES}
						renderItem={renderGridItem}
					/>
				</View>
			</LinearGradient>
		</View>
	);
};

CategoriesScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: '`Εκθεσις',
		// Needed for side drawer navigation
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					onPress={() => navigation.toggleDrawer()}
					title="Menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					size={23}
				/>
			</HeaderButtons>
		),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="cart"
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navigation.navigate({ routeName: 'Cart' })}
				/>
			</HeaderButtons>
		)
	};
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	gradient: {
		flex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		padding: 20
	}
});

export default CategoriesScreen;
