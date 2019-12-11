import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { View, Button, AsyncStorage, Platform, Dimensions, FlatList, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import moment from 'moment';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
import DimensionsForStyle from '../../components/UI/DimensionsForStyle';

import BoldText from '../../components/UI/BoldText';
import OrderItem from '../../components/game/OrderItem';

import Colours from '../../constants/Colours';

import * as questionsActions from '../../store/actions/questions';

const UsersScreen = (props) => {
	const { width, height } = Dimensions.get('window');

	const widthMultiplier = DimensionsForStyle.widthMultiplier;
	const textMultiplier = DimensionsForStyle.textMultiplier;
	const cardHeight = DimensionsForStyle.cardHeight;
	const cardWidth = DimensionsForStyle.cardWidth;

	const [ email, setEmail ] = useState('');
	const [ userId, setUserId ] = useState('');
	const [ usersData, setUsersData ] = useState([]);
	const [ userGrade, setUserGrade ] = useState(0);
	const dispatch = useDispatch();

	const totalPoints = useSelector((state) => state.questions.totalPoints);
	const allUsersData = useSelector((state) => state.questions.allUsersData);

	useEffect(
		() => {
			const getData = async () => {
				// Note: getItem is asynchronous, so we get a promise
				await dispatch(questionsActions.fetchAllUsersData());
				const userData = await AsyncStorage.getItem('userData');
				if (userData) {
					// parse converts a string to an object or array
					const transformedData = JSON.parse(userData);
					const { userEmail } = transformedData;
					// setEmail(userEmail);
					props.navigation.setParams({ userEmail: userEmail });
				}
			};
			getData();
		},
		[ setEmail, dispatch ]
	);

	useEffect(
		() => {
			const getUserID = async () => {
				// Note: getItem is asynchronous, so we get a promise
				const userData = await AsyncStorage.getItem('userData');
				if (!!userData) {
					// parse converts a string to an object or array
					const transformedData = JSON.parse(userData);
					let { userId } = transformedData;
					setUserId(userId);
				}
			};
			getUserID();

			let dataPerUser = [];
			let activeUserData = {};

			for (const key in allUsersData) {
				// This is to show the first 3 winners
				dataPerUser.push(Object.values(allUsersData[key]));
				// This is to get the higher grade of active user
				activeUserData = allUsersData[userId];
			}
			// Get the higher grade of active user
			for (const key in activeUserData) {
				setUserGrade(activeUserData[key].totalPoints);
				setEmail(activeUserData[key].email);
			}

			let winnersList = dataPerUser.flat();
			winnersList.sort((a, b) => (a.totalPoints < b.totalPoints ? 1 : -1));
			setUsersData(winnersList);

			// Get active user's position in the list of winners
			// console.log(winnersList);
			for (let i = 0; i < winnersList.length; i++) {
				console.log('email', email );

				if (winnersList[i].email === email) {
					console.log(i);
				}
			}
			// const index = winnersList.findIndex(item => item.email === email)
			// console.log(index);
		},
		[ setUsersData, allUsersData, setUserGrade ]
	);

	if (email === '') {
		return (
			<CustomLinearGradient>
				<View style={styles.content}>
					<BoldText>
						Προκειμένου να δείτε τα στοιχεία σας, παρακαλούμε συνδεθείτε ή προχωρήσθε σε εγγραφή.
					</BoldText>
					<View style={styles.buttonContainerEntrance}>
						{Platform.OS === 'android' ? (
							<View>
								<CustomButton
									style={styles.buttonStyle}
									title="Πιστοποίηση στοιχείων"
									color={Colours.moccasin_light}
									onPress={() => props.navigation.navigate('Auth')}
								/>
							</View>
						) : (
							<Button
								title="Πιστοποίηση στοιχείων"
								color={Colours.moccasin_light}
								onPress={() => props.navigation.navigate('Auth')}
							/>
						)}
					</View>
				</View>
			</CustomLinearGradient>
		);
	}
	return (
		<CustomLinearGradient>
			<BoldText style={styles.content}>Υψηλότερη προσωπική βαθμολογία: {userGrade}</BoldText>
			<BoldText style={styles.content}>Λίστα νικητών</BoldText>
			{/* {Platform.OS === 'android' ? (
				<View>
					<CustomButton
						style={styles.content}
						title="Επανεκίνηση παιχνιδιού"
						color={Colours.moccasin_light}
						onPress={() => {
							dispatch(questionsActions.saveDataToAllUsersData(totalPoints, email));
							dispatch(questionsActions.deleteAnsweredQuestions());
							dispatch(questionsActions.deleteTotalPoints());
							props.navigation.navigate('Categories');
						}}
					/>
				</View>
			) : (
				<Button
					title="Επανεκίνηση παιχνιδιού"
					color={Colours.maroon}
					onPress={() => {
						dispatch(questionsActions.saveDataToAllUsersData(totalPoints, email));
						dispatch(questionsActions.deleteAnsweredQuestions());
						dispatch(questionsActions.deleteTotalPoints());
						props.navigation.navigate('Categories');
					}}
				/>
			)} */}
			{/* {Platform.OS === 'android' ? (
				<View>
					<CustomButton
						style={styles.buttonStyle}
						title="Βαθμολογίες παικτών"
						color={Colours.moccasin_light}
						onPress={showListOfUsers}
					/>
				</View>
			) : (
				<Button title="Βαθμολογίες παικτών" color={Colours.moccasin_light} onPress={showListOfUsers} />
			)} */}
			<View style={styles.flatListContainer}>
				<FlatList
					data={usersData}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item, index}) => {
						const date = new Date(item.date);
						const elLocale = require('moment/locale/el');
						moment.updateLocale('el', elLocale);
						const formattedDate = moment(date).format('LLL');
						// const options = {
						// 	weekday: 'long',
						// 	year: 'numeric',
						// 	month: 'long',
						// 	day: 'numeric'
						// 	// hour: 'numeric',
						// 	// minute: 'numeric'
						// };
						return (
							<View
								style={{
									height: Math.ceil(cardHeight * height / 4),
									width: Math.ceil(cardWidth * width),
									...styles.content
								}}
							>
								<OrderItem
									totalPoints={item.totalPoints}
									date={formattedDate}
									index={index + 1}
									// date={date.toLocaleString('el-GR', options)}
									// date={
									// 	Platform.OS === 'android' ? (
									// 		formattedDate
									// 	) : (
									// 		date.toLocaleString('el-GR', options)
									// 	)
									// }
									// items={item.items}
									email={item.email}
								/>
							</View>
						);
					}}
				/>
			</View>
		</CustomLinearGradient>
	);
};

UsersScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('userEmail'),
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="cart"
					iconName={Platform.OS === 'android' ? 'md-albums' : 'ios-albums'}
					onPress={() => navigation.navigate({ routeName: 'Cart' })}
				/>
			</HeaderButtons>
		)
	};
};
const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	},
	flatListContainer: {
		flex: 1,
		// width: '100%',
		// maxWidth: '100%',
		// maxHeight: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 2
	},
	content: {
		marginVertical: 12,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default UsersScreen;
