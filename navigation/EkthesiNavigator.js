import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colours from '../constants/Colours';

const ProductsNavigator = createStackNavigator(
	{
		ProductsOverview: ProductsOverviewScreen
	},
	{
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: Platform.OS === 'android' ? Colours.maroon : ''
			},
			headerTintColor: Platform.OS === 'android' ? 'white' : Colours.maroon
		}
	}
);

export default createAppContainer(ProductsNavigator);
