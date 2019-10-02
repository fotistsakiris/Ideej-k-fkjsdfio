import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { Platform, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colours from '../constants/Colours';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CategoriesScreen from '../screens/shop/CategoriesScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import FavoritesScreen from '../screens/shop/FavoritesScreen';

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

const OrdersNavigator = createStackNavigator(
	{
		Orders: OrdersScreen
	},
	{
		// navigationOptions only apply if this Screen here, belongs to another Navigator
		navigationOptions: {
			drawerLabel: 'Παραγγελίες',
			drawerIcon: (drawerConfig) => (
				<Ionicons
					name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
					size={23}
					color={drawerConfig.tintColor}
				/>
			)
		},
		defaultNavigationOptions: defaultNavOptions
	}
);

const FavNavigator = createStackNavigator(
	{
		Favorites: FavoritesScreen,
		DetailScreen: ProductDetailScreen
	},
	{
		// initialRouteName: 'Categories',
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
				Platform.OS === 'android' ? <Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Έκθεση</Text> : 'Έκθεση'
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
					<Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Αγαπημένα</Text>
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
					<Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Παραγγελίες</Text>
				) : (
					'Παραγγελίες'
				)
		}
	}
};

const MultiTabNavigator =
	Platform.OS === 'android'
		? createMaterialBottomTabNavigator(tabScreenConfig, {
				// NO tabBarOptions...
				activeTintColor: 'white',
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

const MainNavigator = createDrawerNavigator(
	{
		MultiNav: {
			screen: MultiTabNavigator,
			navigationOptions: {
				drawerLabel: 'Περιεχόμενα',
				// drawerIcon: (drawerConfig) => (
				// 	<Ionicons
				// 		name={Platform.OS === 'android' ? 'md-home' : 'ios-home'}
				// 		size={23}
				// 		color={drawerConfig.tintColor}
				// 	/>
				// )
			}
		},
		Ekthesis: {
			screen: EkthesisNavigator,
			navigationOptions: {
				drawerLabel: 'Έκθεση',
				drawerIcon: (tabInfo) => {
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
				drawerLabel:
					Platform.OS === 'android' ? <Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Έκθεση</Text> : 'Έκθεση'
			}
		},
		Favorites: {
			screen: FavNavigator,
			navigationOptions: {
				drawerIcon: (tabInfo) => {
					return <MaterialIcons name="favorite" size={25} color={tabInfo.tintColor} />;
				},
				tabBarColor: Colours.gr_brown,
				drawerLabel:
					Platform.OS === 'android' ? (
						<Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Αγαπημένα</Text>
					) : (
						'Αγαπημένα'
					)
			}
		},
		Orders: {
			screen: OrdersNavigator,
			navigationOptions: {
				drawerIcon: (tabInfo) => {
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
						<Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Παραγγελίες</Text>
					) : (
						'Παραγγελίες'
					)
			}
		}
	},
	{
		contentOptions: {
			activeTintColor: Colours.gr_brown,
			labelStyle: {
				fontFamily: 'GFSNeohellenic-Bold',
				fontSize: 20
			}
		},
		drawerWidth: 200
	}
);

export default createAppContainer(MainNavigator);
