// import React from 'react';
// import { Platform, Text, SafeAreaView, Button, Dimensions, View } from 'react-native';
// import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
// import { useDispatch } from 'react-redux';

// import { createAppContainer, createSwitchNavigator } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';

// import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
// import Colours from '../constants/Colours';
// import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
// import CategoriesScreen from '../screens/shop/CategoriesScreen';
// import CartScreen from '../screens/shop/CartScreen';
// import OrdersScreen from '../screens/shop/OrdersScreen';
// import FavoritesScreen from '../screens/shop/FavoritesScreen';
// import AdminProductsOverview from '../screens/admin/AdminProductsOverview';
// import EditProductScreen from '../screens/admin/EditProductScreen';
// import AuthScreen from '../screens/admin/AuthScreen';
// import ShopInfoScreen from '../screens/admin/ShopInfoScreen';
// import StartUpScreen from '../screens/StartUpScreen';

// import CustomButton from '../components/UI/CustomButton';
// import BoldText from '../components/UI/BoldText';
// import * as authActions from '../store/actions/auth';

// // const width = (props) => {
// // 	return Dimensions.get('window').width; // for putting the buttons in column for small screens
// // };

// const defaultNavOptions = {
// 	headerBackTitle: 'Πίσω',
// 	headerStyle: {
// 		backgroundColor: Platform.OS === 'android' ? Colours.gr_brown : Colours.moccasin_light
// 	},
// 	headerTitleStyle: {
// 		fontFamily: 'GFSNeohellenic-Bold',
// 		fontSize: 22
// 	},
// 	headerBackTitleStyle: {
// 		fontFamily: 'GFSNeohellenic-Regular',
// 		fontSize: 22
// 	},
// 	headerTintColor: Platform.OS === 'android' ? Colours.moccasin_light : Colours.gr_brown
// };

// const EkthesisNavigator = createStackNavigator(
// 	{
// 		Categories: CategoriesScreen,
// 		ProductsOverview: ProductsOverviewScreen,
// 		DetailScreen: ProductDetailScreen,
// 		Cart: CartScreen
// 	},
// 	{
// 		defaultNavigationOptions: defaultNavOptions
// 	}
// );

// const FavNavigator = createStackNavigator(
// 	{
// 		Favorites: FavoritesScreen
// 	},
// 	{
// 		defaultNavigationOptions: defaultNavOptions
// 	}
// );

// const OrdersNavigator = createStackNavigator(
// 	{
// 		Orders: OrdersScreen
// 	},
// 	{
// 		// navigationOptions only apply if this Screen here, belongs to another Navigator
// 		// navigationOptions: {
// 		// 	drawerLabel: 'Παραγγελίες'
// 		// },
// 		defaultNavigationOptions: defaultNavOptions
// 	}
// );

// const AdminNavigator = createStackNavigator(
// 	{
// 		Admin: AdminProductsOverview,
// 		EditProduct: EditProductScreen
// 	},
// 	{
// 		defaultNavigationOptions: defaultNavOptions
// 	}
// );

// const ShopInfoNavigator = createStackNavigator(
// 	{
// 		ShopInfo: ShopInfoScreen
// 	},
// 	{
// 		defaultNavigationOptions: defaultNavOptions
// 	}
// );

// const MainNavigator = createDrawerNavigator(
// 	{
// 		Ekthesis: {
// 			screen: EkthesisNavigator,
// 			navigationOptions: {
// 				drawerLabel: (
// 					<View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
// 						<BoldText>'Eκθεσις</BoldText>
// 					</View>
// 				),
// 				drawerIcon: (tabInfo) => (
// 					<Ionicons
// 						name={Platform.OS === 'android' ? 'md-home' : 'ios-home'}
// 						size={23}
// 						color={tabInfo.tintColor}
// 					/>
// 				)
// 			}
// 		},
// 		Favorites: {
// 			screen: FavNavigator,
// 			navigationOptions: {
// 				drawerLabel: (
// 					<View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
// 						<BoldText>Αγαπημένα</BoldText>
// 					</View>
// 				),
// 				drawerIcon: (tabInfo) => {
// 					return <MaterialIcons name="favorite" size={25} color={tabInfo.tintColor} />;
// 				}
// 			}
// 		},
// 		Orders: {
// 			screen: OrdersNavigator,
// 			navigationOptions: {
// 				drawerLabel: (
// 					<View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
// 						<BoldText>Παραγγελίες</BoldText>
// 					</View>
// 				),
// 				drawerIcon: (tabInfo) => {
// 					return (
// 						<Ionicons
// 							name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
// 							size={25}
// 							color={tabInfo.tintColor}
// 						/>
// 					);
// 				}
// 			}
// 		},
// 		Admin: {
// 			screen: AdminNavigator,
// 			navigationOptions: {
// 				drawerLabel: (
// 					<View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
// 						<BoldText>Διαχειριστής</BoldText>
// 					</View>
// 				),
// 				drawerIcon: (tabInfo) => {
// 					return <FontAwesome name="user-o" size={23} color={tabInfo.tintColor} />;
// 				}
// 			}
// 		},
// 		ShopInfo: {
// 			screen: ShopInfoNavigator,
// 			navigationOptions: {
// 				drawerLabel: (
// 					<View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
// 						<BoldText>Κατάστημα</BoldText>
// 					</View>
// 				),
// 				drawerIcon: (tabInfo) => {
// 					return <FontAwesome5 name="warehouse" size={20} color={tabInfo.tintColor} />;
// 				}
// 			}
// 		}
// 	},
// 	{
// 		contentOptions: {
// 			activeTintColor: Colours.gr_brown,
// 			// Not needed, we use View and Text...
// 			// labelStyle: {
// 			// 	fontFamily: 'GFSNeohellenic-Bold',
// 			// 	fontSize: 20
// 			// }
// 		},
// 		// This allows you to set your own content instead of the default.
// 		// This component could have been created in a separate file
// 		contentComponent: (props) => {
// 			const dispatch = useDispatch();
// 			return (
// 				<View style={{ flex: 1, paddingTop: 20 }}>
// 					<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
// 						{/* These are the default drawer items */}
// 						<DrawerNavigatorItems {...props} />
// 						{/* Plus our custom button */}
// 						{Platform.OS === 'android' ? (
// 							<CustomButton
// 								title="Έξοδος"
// 								onPress={() => {
// 									dispatch(authActions.logout());
// 									// Not needed because we dispatch this navigation in navigationContainer...
// 									// props.navigation.navigate('Auth');
// 								}}
// 							/>
// 						) : (
// 							<Button
// 								title="Έξοδος"
// 								color={Colours.maroon}
// 								onPress={() => {
// 									dispatch(authActions.logout());
// 									// Not needed because we dispatch this navigation in navigationContainer...
// 									// props.navigation.navigate('Auth');
// 								}}
// 							/>
// 						)}
// 					</SafeAreaView>
// 				</View>
// 			);
// 		},
// 		drawerWidth: 230,
// 		drawerBackgroundColor: Colours.moccasin_light,
// 		overlayColor: Colours.chocolateRGBA,
		
// 	},
	
// );

// const AuthNavigator = createStackNavigator(
// 	{
// 		Auth: AuthScreen
// 	},
// 	{
// 		defaultNavigationOptions: defaultNavOptions
// 	}
// );

// const SwitchNavigator = createSwitchNavigator({
// 	StartUp: StartUpScreen,
// 	Main: MainNavigator,
// 	Auth: AuthNavigator,
// });

// export default createAppContainer(SwitchNavigator);
