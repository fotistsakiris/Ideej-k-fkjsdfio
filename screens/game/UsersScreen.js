import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { View, Button, AsyncStorage, Platform, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';

import * as questionsActions from '../../store/actions/questions';

const UsersScreen = (props) => {
	const [ email, setEmail ] = useState('');
	const [ userData, setUserData ] = useState([]);
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
					setEmail(userEmail);
					props.navigation.setParams({ userEmail: userEmail });
				}
			};
			getData();
		},
		[ setEmail, dispatch ]
	);

	
		const showListOfUsers = () => {
			let dataPerUser = [];
			for (const key in allUsersData) {
				dataPerUser.push(allUsersData[key]);
			}

			dataPerUser.sort((a, b) => (a.totalPoints > b.totalPoints ? 1 : -1));
			setUserData(dataPerUser)
		}
		console.log(userData);

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
			<View style={styles.centered}>
				<BoldText style={styles.email}>{email}</BoldText>
			</View>
			<View style={styles.centered}>
				<BoldText style={styles.email}>Βαθμολογία: {totalPoints}</BoldText>
			</View>
			<View style={styles.centered}>
				{Platform.OS === 'android' ? (
					<View>
						<CustomButton
							style={styles.buttonStyle}
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
						color={Colours.moccasin_light}
						onPress={() => {
							dispatch(questionsActions.saveDataToAllUsersData(totalPoints, email));
							dispatch(questionsActions.deleteAnsweredQuestions());
							dispatch(questionsActions.deleteTotalPoints());
							props.navigation.navigate('Categories');
						}}
					/>
				)}
				{Platform.OS === 'android' ? (
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
				)}
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
	email: {
		fontSize: 30
	}
});

export default UsersScreen;
