import React from 'react';
import { Platform, Text, SafeAreaView, Dimensions, StyleSheet, View } from 'react-native';
import {
	Ionicons,
	MaterialIcons,
	FontAwesome5,
	Octicons,
	Feather,
	SimpleLineIcons,
	FontAwesome
} from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

// import { AsyncStorage } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { fadeIn } from 'react-navigation-transitions';

import CategoriesScreen from '../screens/game/CategoriesScreen';
import QuestionsOverviewScreen from '../screens/game/QuestionsOverviewScreen';
import FavoritesScreen from '../screens/game/FavoritesScreen';
import ChoicesScreen from '../screens/game/ChoicesScreen';
import QuestionDetailScreen from '../screens/game/QuestionDetailScreen';
import UsersScreen from '../screens/game/UsersScreen';
import GameInfoScreen from '../screens/game/GameInfoScreen';
import CartScreen from '../screens/game/CartScreen';
import AdminCategoriesScreen from '../screens/admin/AdminCategoriesScreen';
import AdminQuestionsOverview from '../screens/admin/AdminQuestionsOverview';
import EditQuestionScreen from '../screens/admin/EditQuestionScreen';
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
let buttonMultiplier = 0.05
if (width > 800) {
	buttonMultiplier = 0.03
}


const defaultNavOptions = {
	headerBackTitle: 'Πίσω',
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colours.gr_brown : Colours.moccasin_light
	},
	headerTitleStyle: {
		fontFamily: 'GFSNeohellenic-Bold',
		fontSize: buttonMultiplier * width
	},
	headerBackTitleStyle: {
		fontFamily: 'GFSNeohellenic-Regular',
		fontSize: buttonMultiplier * width
	},
	headerTintColor: Platform.OS === 'android' ? Colours.moccasin_light : Colours.gr_brown
};

const EkthesisNavigator = createStackNavigator(
	{
		Categories: CategoriesScreen,
		QuestionsOverview: QuestionsOverviewScreen,
		DetailScreen: QuestionDetailScreen,
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
		DetailScreen: QuestionDetailScreen // So we do not get to see a snapshop of Categories when navigating from FavoritesScreen to DetailsScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const OrdersNavigator = createStackNavigator(
	{
		Orders: ChoicesScreen
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
		ShopInfo: GameInfoScreen
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
		en_touto_nika: {
			screen: EkthesisNavigator,
			navigationOptions: {
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 12, paddingHorizontal: 5 }}>'ΕΝ ΤΟΥΤΩ ΝΙΚΑ</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => (
					<Ionicons
						name={Platform.OS === 'android' ? 'md-home' : 'ios-home'}
						size={Math.ceil(width * buttonMultiplier)}
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
						<BoldText style={{ paddingVertical: 12, paddingHorizontal: 5 }}>Αγαπημένα</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => {
					return <MaterialIcons name="favorite" size={Math.ceil(width * buttonMultiplier)} color={tabInfo.tintColor} />;
				}
			}
		},
		Choices: {
			screen: OrdersNavigator,
			navigationOptions: {
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 12, paddingHorizontal: 5 }}>Επιλογές</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => {
					return <Octicons name="list-unordered" size={Math.ceil(width * buttonMultiplier)} color={tabInfo.tintColor} />;
				}
			}
		},
		GameInfo: {
			screen: ShopInfoNavigator,
			navigationOptions: {
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 12, paddingHorizontal: 5 }}>Πληροφορίες</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => {
					return <FontAwesome5 name="warehouse" size={Math.ceil(width * buttonMultiplier)} color={tabInfo.tintColor} />;
				}
			}
		},
		User: {
			screen: UserNavigator,
			navigationOptions: {
				drawerLabel: (
					<View>
						<BoldText style={{ paddingVertical: 12, paddingHorizontal: 5 }}>Παίκτης</BoldText>
					</View>
				),
				drawerIcon: (tabInfo) => {
					return <FontAwesome name="user" size={Math.ceil(width * buttonMultiplier)} color={tabInfo.tintColor} />;
				}
			}
		}
		// Auth: {
		// 	screen: AuthNavigator,
		// 	navigationOptions: {
		// 		drawerLabel: (
		// 			<View>
		// 				<BoldText style={{ paddingVertical: 12, paddingHorizontal: 5 }}>Σύνδεση/Εγγραφή</BoldText>
		// 			</View>
		// 		),
		// 		drawerIcon: (tabInfo) => {
		// 			return (
		// 				<Ionicons
		// 					name="ios-log-in"
		// 					// name={Platform.OS === 'android' ? 'user-plus' : 'ios-list'}
		// 					size={Math.ceil(width * buttonMultiplier)}
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
			// const [ adminId, setAdmidId ] = useState(null);

			// This is for showing the Admin screen link, if user is an admin.
			const userIdExists = useSelector((state) => state.auth.userId);

			// if (userIdExists === 'tSSja6ZrVPWkN4Vh6K8elzQ8dmp2' || userIdExists === 'ib4vLOYdTraLKHtBbQv6Y9X3Vtv2') {
			// 	const getAdminsUserId = async () => {
			// 		const userData = await AsyncStorage.getItem('userData');
			// 		const transformedData = JSON.parse(userData);
			// 		const { userId } = transformedData;

			// 		setAdmidId(userId);
			// 	};
			// 	getAdminsUserId();
			// }

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
								size={Math.ceil(width * buttonMultiplier)}
								iconStyle={{ marginHorizontal: 7 }}
								color="#888"
								onPress={() => props.navigation.navigate('Auth')}
							>
								<Text style={styles.exodos}> Σύνδεση/Εγγραφή</Text>
							</SimpleLineIcons.Button>
						) : null}
						{/* Button for logging out */}
						{userIdExists ? (
							<SimpleLineIcons.Button
								name="logout"
								backgroundColor={Colours.moccasin_light}
								size={Math.ceil(width * buttonMultiplier)}
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
						) : null}
						{/* Button for Admin. It shows up, only if user is Admin */}
						{userIdExists === '5E5hc3oOCJRYM4RByLf7ORTIP103' ? (
							<Feather.Button
								name="user"
								backgroundColor={Colours.moccasin_light}
								size={Math.ceil(width * buttonMultiplier)}
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
		overlayColor: Colours.maroonRGBA
	}
);

const AdminNavigator = createStackNavigator(
	{
		AdminCategories: AdminCategoriesScreen,
		AdminProducts: AdminQuestionsOverview,
		EditQuestion: EditQuestionScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const SwitchNavigator = createSwitchNavigator({
	StartUp: StartUpScreen,
	Auth: AuthNavigator,
	Admin: AdminNavigator,
	Main: MainNavigator,
});

const styles = StyleSheet.create({
	exodos: {
		fontFamily: 'GFSNeohellenic-Bold',
		textAlign: 'left',
		fontSize: buttonMultiplier * width
	}
});

export default createAppContainer(SwitchNavigator);
