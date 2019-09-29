import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colours from '../constants/Colours';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CategoriesScreen from '../screens/shop/CategoriesScreen';
import CartScreen from '../screens/shop/CartScreen';

const ProductsNavigator = createStackNavigator(
	{
		Categories: CategoriesScreen,
		ProductsOverview: ProductsOverviewScreen,
		DetailScreen: ProductDetailScreen,
		Cart: CartScreen
	},
	{
		defaultNavigationOptions: {
			headerBackTitle: 'Πίσω',
			headerStyle: {
				backgroundColor: Platform.OS === 'android' ? Colours.gr_brown : ''
			},
			headerTitleStyle: {
				fontFamily: 'GFSNeohellenic-Bold',
				fontSize: 22
			},
			headerTintColor: Platform.OS === 'android' ? 'white' : Colours.gr_brown
		}
	}
);

export default createAppContainer(ProductsNavigator);
