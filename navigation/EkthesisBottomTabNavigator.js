import React from 'react';
import { Platform, Text } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colours from '../constants/Colours';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CategoriesScreen from '../screens/shop/CategoriesScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import FavoritesScreen from '../screens/shop/FavoritesScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import EditProductScreen from '../screens/admin/EditProductScreen';

const defaultNavOptions = {
	headerBackTitle: 'Πίσω',
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colours.gr_brown : ''
	},
	headerTitleStyle: {
		fontFamily: 'GFSNeohellenic-Bold',
		fontSize: 22
	},
	headerBackTitleStyle: {
		fontFamily: 'GFSNeohellenic-Regular',
		fontSize: 22
	},
	headerTintColor: Platform.OS === 'android' ? Colours.moccasin_light : Colours.gr_brown
};

const EkthesisNavigator = createStackNavigator(
	{
		Categories: CategoriesScreen,
		ProductsOverview: ProductsOverviewScreen,
		DetailScreen: ProductDetailScreen,
		Cart: CartScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const FavNavigator = createStackNavigator(
	{
		Favorites: FavoritesScreen,
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const OrdersNavigator = createStackNavigator(
	{
		Orders: OrdersScreen
	},
	{
		// navigationOptions only apply if this Screen here, belongs to another Navigator
		navigationOptions: {
			drawerLabel: 'Παραγγελίες',
		},
		defaultNavigationOptions: defaultNavOptions
	}
);


const AdminNavigator = createStackNavigator(
	{
		Admin: AdminProductsScreen,
		EditProduct: EditProductScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);



const tabScreenConfig = {
	Ekthesis: {
		screen: EkthesisNavigator,
		navigationOptions: {
			tabBarIcon: (tabInfo) => {
				return (
					<Ionicons
						name={Platform.OS === 'android' ? 'md-home' : 'ios-home'}
						size={25}
						color={tabInfo.tintColor}
					/>
				);
			},
			tabBarColor: Colours.gr_brown,
			// Use Platform... otherwise we loose the color from iOS.
			tabBarLabel:
				Platform.OS === 'android' ? 
				 <Text style={{ fontWeight:'bold', fontSize: 14, fontFamily: 'GFSNeohellenic-Bold' }}>{`Έκθεσις`}</Text> : `< Έκθεσις`
		}
	},
	Favorites: {
		screen: FavNavigator,
		navigationOptions: {
			tabBarIcon: (tabInfo) => {
				return <MaterialIcons name="favorite" size={25} color={tabInfo.tintColor} />;
			},
			tabBarColor: Colours.gr_brown,
			tabBarLabel:
				Platform.OS === 'android' ? (
					<Text style={{ fontWeight:'bold', fontSize: 14, fontFamily: 'GFSNeohellenic-Bold' }}>Αγαπημένα</Text>
				) : (
					'Αγαπημένα'
				)
		}
	},
	Orders: {
		screen: OrdersNavigator,
		navigationOptions: {
			tabBarIcon: (tabInfo) => {
				return (
					<Ionicons
						name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
						size={25}
						color={tabInfo.tintColor}
					/>
				);
			},
			tabBarColor: Colours.gr_brown,
			tabBarLabel:
				Platform.OS === 'android' ? (
					<Text style={{ fontWeight:'bold', fontSize: 14, fontFamily: 'GFSNeohellenic-Bold' }}>Παραγγελίες</Text>
				) : (
					'Παραγγελίες'
				)
		}
	},
	Admin: {
		screen: AdminNavigator,
		navigationOptions: {
			tabBarIcon: (tabInfo) => {
				return (
					<FontAwesome
						name='user-o'
						size={23}
						color={tabInfo.tintColor}
					/>
				);
			},
			tabBarColor: Colours.gr_brown,
			tabBarLabel:
				Platform.OS === 'android' ? (
					<Text style={{ fontWeight:'bold', fontSize: 14, fontFamily: 'GFSNeohellenic-Bold' }}>Παραγγελίες</Text>
				) : (
					'Διαχειριστής'
				)
		}
	}
};

const MultiTabNavigator =
	Platform.OS === 'android'
		? createMaterialBottomTabNavigator(tabScreenConfig, {
				// NO tabBarOptions...
				activeTintColor: {Colours.moccasin_light},
				shifting: true,
				barStyle: {
					backgroundColor: Colours.gr_brown
				}
			})
		: createBottomTabNavigator(tabScreenConfig, {
				tabBarOptions: {
					activeTintColor: Colours.gr_brown,
					labelStyle: {
						fontFamily: 'GFSNeohellenic-Bold',
						fontSize: 18
					}
				}
			});

export default createAppContainer(MultiTabNavigator);
