import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colours from '../constants/Colours';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CategoriesScreen from '../screens/shop/CategoriesScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';

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
	headerTintColor: Platform.OS === 'android' ? 'white' : Colours.gr_brown
};

const ProductsNavigator = createStackNavigator(
	{
		Categories: CategoriesScreen,
		ProductsOverview: ProductsOverviewScreen,
		DetailScreen: ProductDetailScreen,
		Cart: CartScreen
	},
	{
		navigationOptions: {
			drawerIcon: (drawerConfig) => (
				<Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
				size={23} 
				color={drawerConfig.tintColor} />
			)
		},
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
			drawerIcon: (drawerConfig) => (
				<Ionicons name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
				size={23} 
				color={drawerConfig.tintColor} />
			)
		},
		defaultNavigationOptions: defaultNavOptions
	}
);

const ShopNavigator = createDrawerNavigator(
	{
		
		Products: ProductsNavigator,
		Orders: OrdersNavigator,
		// Admin: AdminNavigator
	},
	{
		contentOptions: {
			activeTintColor: Colours.chocolate
		}
	}
);

export default createAppContainer(ShopNavigator);
