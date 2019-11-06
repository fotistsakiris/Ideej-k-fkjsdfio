import React from 'react';
import { Platform, Text, SafeAreaView, Button, View } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colours from '../constants/Colours';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CategoriesScreen from '../screens/shop/CategoriesScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import FavoritesScreen from '../screens/shop/FavoritesScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import EditProductScreen from '../screens/admin/EditProductScreen';
import AuthScreen from '../screens/admin/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';

import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
	headerBackTitle: 'Πίσω',
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colours.gr_brown : Colours.lightseagreen 
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

const FavNavigator = createStackNavigator(
	{
		Favorites: FavoritesScreen
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
		// navigationOptions: {
		// 	drawerLabel: 'Παραγγελίες'
		// },
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

const MainNavigator = createDrawerNavigator(
	{
		Ekthesis: {
			screen: EkthesisNavigator,
			navigationOptions: {
				drawerLabel: 'Εκθεσις',
				drawerIcon: (tabInfo) => (
					<Ionicons
						name={Platform.OS === 'android' ? 'md-home' : 'ios-home'}
						size={23}
						color={tabInfo.tintColor}
					/>
				)
			}
		},
		Favorites: {
			screen: FavNavigator,
			navigationOptions: {
				drawerLabel: 'Αγαπημένα',
				drawerIcon: (tabInfo) => {
					return <MaterialIcons name="favorite" size={25} color={tabInfo.tintColor} />;
				},
			}
		},
		Orders: {
			screen: OrdersNavigator,
			navigationOptions: {
				drawerLabel: 'Παραγγελίες',
				drawerIcon: (tabInfo) => {
					return (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
							size={25}
							color={tabInfo.tintColor}
						/>
					);
				},
			}
		},
		Admin: {
			screen: AdminNavigator,
			navigationOptions: {
				drawerLabel: 'Διαχειριστής',
				drawerIcon: (tabInfo) => {
					return <FontAwesome name="user-o" size={23} color={tabInfo.tintColor} />;
				},
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
		// This allows you to set your own content instead of the default.
		// This component could have been created in a separate file
		contentComponent: (props) => {
			const dispatch = useDispatch();
			return (
				<View style={{ flex: 1, paddingTop: 20 }}>
					<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
						{/* These are the default drawer items */}
						<DrawerNavigatorItems {...props} />
						{/* Plus our custom button */}
						<Button
							title="Έξοδος"
							color={Colours.chocolate}
							onPress={() => {
								dispatch(authActions.logout());
								// Not needed because we dispatch this navigation in navigationContainer...
								// props.navigation.navigate('Auth');
							}}
						/>
					</SafeAreaView>
				</View>
			);
		},
		drawerWidth: 220
	}
);

const AuthNavigator = createStackNavigator(
	{
		Auth: AuthScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const SwitchNavigator = createSwitchNavigator({
	// StartUp: StartUpScreen,
	// Auth: AuthNavigator,
	Main: MainNavigator
});

export default createAppContainer(SwitchNavigator);
