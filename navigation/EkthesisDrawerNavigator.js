import React, { useState } from 'react';
import { Platform, Text, SafeAreaView, Dimensions, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Octicons, Feather, SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { AsyncStorage } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { fadeIn } from 'react-navigation-transitions';

import CategoriesScreen from '../screens/shop/CategoriesScreen';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import FavoritesScreen from '../screens/shop/FavoritesScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import UsersScreen from '../screens/shop/UsersScreen';
import ShopInfoScreen from '../screens/shop/ShopInfoScreen';
import CartScreen from '../screens/shop/CartScreen';
import AdminCategoriesScreen from '../screens/admin/AdminCategoriesScreen';
import AdminProductsOverview from '../screens/admin/AdminProductsOverview';
import EditProductScreen from '../screens/admin/EditProductScreen';
import AuthScreen from '../screens/admin/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';

import Colours from '../constants/Colours';
import CustomButton from '../components/UI/CustomButton';
import BoldText from '../components/UI/BoldText';
import * as authActions from '../store/actions/auth';

// const width = (props) => {
// 	return Dimensions.get('window').width; // for putting the buttons in column for small screens
// };
const width = Dimensions.get('window').width; 

const defaultNavOptions = {
	headerBackTitle: 'Πίσω',
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colours.gr_brown : Colours.moccasin_light
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
		// AdminCategories: AdminCategoriesScreen,
	},
	{
		defaultNavigationOptions: defaultNavOptions,
		transitionConfig: () => fadeIn()
	}
);

const FavNavigator = createStackNavigator(
	{
		Favorites: FavoritesScreen,
		DetailScreen: ProductDetailScreen // So we do not get to see a snapshop of Categories when navigating from FavoritesScreen to DetailsScreen
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

const UserNavigator = createStackNavigator(
	{
		User: UsersScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const ShopInfoNavigator = createStackNavigator(
	{
		ShopInfo: ShopInfoScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
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

const MainNavigator = createDrawerNavigator(
	{
		Ekthesis: {
			screen: EkthesisNavigator,
			navigationOptions: {
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 5, paddingHorizontal: 1 }}>'Eκθεση</BoldText>
					</View>
				),
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
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 5, paddingHorizontal: 1 }}>Αγαπημένα</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => {
					return <MaterialIcons name="favorite" size={25} color={tabInfo.tintColor} />;
				}
			}
		},
		Orders: {
			screen: OrdersNavigator,
			navigationOptions: {
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 5, paddingHorizontal: 1 }}>Παραγγελίες</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => {
					return (
						<Octicons
							name='list-unordered'
							size={25}
							color={tabInfo.tintColor}
						/>
					);
				}
			}
		},
		ShopInfo: {
			screen: ShopInfoNavigator,
			navigationOptions: {
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 5, paddingHorizontal: 1 }}>Κατάστημα</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => {
					return <FontAwesome5 name="warehouse" size={20} color={tabInfo.tintColor} />;
				}
			}
		},
		User: {
			screen: UserNavigator,
			navigationOptions: {
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 5, paddingHorizontal: 1 }}>Χρήστης</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => {
					return <FontAwesome name="user" size={25} color={tabInfo.tintColor} />;
				}
			}
		}
		// Auth: {
		// 	screen: AuthNavigator,
		// 	navigationOptions: {
		// 		drawerLabel: (
		// 			<View>
		// 				<BoldText style={{ paddingVertical: 5, paddingHorizontal: 1 }}>Σύνδεση/Εγγραφή</BoldText>
		// 			</View>
		// 		),
		// 		drawerIcon: (tabInfo) => {
		// 			return (
		// 				<Ionicons
		// 					name="ios-log-in"
		// 					// name={Platform.OS === 'android' ? 'user-plus' : 'ios-list'}
		// 					size={25}
		// 					color={tabInfo.tintColor}
		// 				/>
		// 			);
		// 		}
		// 	}
		// }
	},
	{
		contentOptions: {
			activeTintColor: Colours.gr_brown
			// Not needed, we use View and Text...
			// labelStyle: {
			// 	fontFamily: 'GFSNeohellenic-Bold',
			// 	fontSize: 20
			// }
		},
		// This allows you to set your own content instead of the default.
		// This component could have been created in a separate file
		contentComponent: (props) => {
			const dispatch = useDispatch();
			const [ adminId, setAdmidId ] = useState(null);

			// This is for showing the Admin screen link, if user is an admin.
			const userIdExists = useSelector((state) => state.auth.userId);

			if (userIdExists === 'tSSja6ZrVPWkN4Vh6K8elzQ8dmp2' || userIdExists === 'ib4vLOYdTraLKHtBbQv6Y9X3Vtv2') {
				const getAdminsUserId = async () => {
					const userData = await AsyncStorage.getItem('userData');
					const transformedData = JSON.parse(userData);
					const { userId } = transformedData;

					setAdmidId(userId);
				};
				getAdminsUserId();
			}

			return (
				<View style={{ flex: 1, paddingTop: 20 }}>
					<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
						{/* These are the default drawer items */}
						<DrawerNavigatorItems {...props} />
						{/* Plus our custom buttons */}
						{/* Button for logging/signing in/up.
						 This is for hidding the login/signup screen, if user is already logged in.
						 */}
						{!userIdExists ? (
							<SimpleLineIcons.Button
								name="login"
								backgroundColor={Colours.moccasin_light}
								size={23}
								iconStyle={{ marginHorizontal: 7 }}
								color="#888"
								onPress={() => props.navigation.navigate('Auth')}
							>
								<Text style={styles.exodos}> Σύνδεση/Εγγραφή</Text>
							</SimpleLineIcons.Button>
						) : null}
						{/* Button for logging out */}
						<SimpleLineIcons.Button
							name="logout"
							backgroundColor={Colours.moccasin_light}
							size={23}
							iconStyle={{ marginHorizontal: 7 }}
							color="#888"
							onPress={() => {
								dispatch(authActions.logout());
								// Not needed because we dispatch this navigation in navigationContainer...
								// props.navigation.navigate('Auth');
							}}
						>
							<Text style={styles.exodos}> Έξοδος</Text>
						</SimpleLineIcons.Button>
						{/* Button for Admin. It shows up, only if user is Admin */}
						{adminId === 'tSSja6ZrVPWkN4Vh6K8elzQ8dmp2' || adminId === 'ib4vLOYdTraLKHtBbQv6Y9X3Vtv2' ? (
							<Feather.Button
								name="user"
								backgroundColor={Colours.moccasin_light}
								size={23}
								iconStyle={{ marginHorizontal: 7 }}
								color="#888"
								onPress={() => props.navigation.navigate('AdminCategories')}
							>
								<Text style={styles.exodos}> Διαχειριστής</Text>
							</Feather.Button>
						) : null}
					</SafeAreaView>
				</View>
			);
		},
		drawerWidth: 0.6 * width,
		drawerBackgroundColor: Colours.moccasin_light,
		overlayColor: Colours.chocolateRGBA
	}
);

const AdminNavigator = createStackNavigator(
	{
		AdminCategories: AdminCategoriesScreen,
		AdminProducts: AdminProductsOverview,
		EditProduct: EditProductScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const SwitchNavigator = createSwitchNavigator({
	StartUp: StartUpScreen,
	Auth: AuthNavigator,
	Main: MainNavigator,
	Admin: AdminNavigator
});

const styles = StyleSheet.create({
	exodos: {
		fontFamily: 'GFSNeohellenic-Bold',
		textAlign: 'left',
		fontSize: 22
	}
});

export default createAppContainer(SwitchNavigator);
