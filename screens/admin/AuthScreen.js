import React, { useReducer, useEffect, useState, useCallback } from 'react';
import {
	View,
	KeyboardAvoidingView,
	ScrollView,
	Keyboard,
	ActivityIndicator,
	Platform,
	Button,
	StyleSheet,
	Alert, 
	Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import CustomButton from '../../components/UI/CustomButton';
import Colours from '../../constants/Colours';
import * as authActions from '../../store/actions/auth';
import BoldText from '../../components/UI/BoldText';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {

	if (action.type === FORM_INPUT_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid
		};
		let updatedFormIsValid = true;
		for (const key in updatedValidities) {
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}
		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues
		};
	}
	return state;
};

const AuthScreen = (props) => {
	const {width, height} = Dimensions.get('window'); 
	let widthMultiplier = 0.7
	let heightMultiplier = 0.055
	let cardHeight = 0.9
	let cardWidth = 0.8
	if (width > 800 ) {
		widthMultiplier = 0.4
		heightMultiplier = 0.038
		cardHeight = 0.5
		cardWidth = 0.5
	}
	// const userId = useSelector((state) => state.auth.userId);

	const [ error, setError ] = useState();
	const [ isLoading, setIsLoading ] = useState(false);
	const [ isSignUp, setIsSignUp ] = useState(false);

	const dispatch = useDispatch();

	const [ formState, dispatchFormState ] = useReducer(formReducer, {
		inputValues: {
			email: '',
			password: ''
		},
		inputValidities: {
			email: false,
			password: false
		},
		formIsValid: false
	});

	useEffect(
		() => {
			if (error) {
				Alert.alert('Σφάλμα κατά την διαδικασία πιστοποίησης του χρήστη!', error, [ { text: 'Εντάξει' } ]);
			}
		},
		[ error ]
	);

	// We tried to navigate to AdminCategories from login,
	// but authentication takes a while... so it doesn't work...
	// It's OK! The admin only needs to navigate to Amdin Categories just once.
	// After that he/she gets navigated there in StartUpScreen.
	// let navigateTo = 'Categories'
	// console.log(userId);
	// useEffect(() => {
	// 	if (userId === 'tSSja6ZrVPWkN4Vh6K8elzQ8dmp2' || userId === 'ib4vLOYdTraLKHtBbQv6Y9X3Vtv2') {
	// 		navigateTo = 'AdminCategories'
	// 	} 
	// }, [userId])
	

	const authHandler = useCallback(
		async () => {
			Keyboard.dismiss();
			let action;
			if (isSignUp) {
				action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
			} else {
				action = authActions.login(formState.inputValues.email, formState.inputValues.password);
			}
			setError(null);
			setIsLoading(true);
			try {
				await dispatch(action);
				props.navigation.navigate('Categories');
			} catch (err) {
				setError(err.message);
				//Note: only if we have an error we stay in this screen...
				setIsLoading(false);
			}
		},
		[ dispatch, formState, dispatchFormState ]
	);

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier
			});
		},
		[ dispatchFormState ]
	);

	return (
		<CustomLinearGradient>
			{/* <Card style={styles.authContainer}> */}
			<View style={styles.buttonContainerEntrance}>
				<BoldText> Είσοδος στην Έκθεση </BoldText>
				{Platform.OS === 'android' ? (
					<View style={styles.buttonSignup}>
						<CustomButton
							title="Είσοδος"
							color={Colours.moccasin_light}
							onPress={() => props.navigation.navigate('Categories')}
						/>
					</View>
				) : (
					<Button
						title="Είσοδος"
						color={Colours.moccasin_light}
						onPress={() => props.navigation.navigate('Categories')}
					/>
				)}
			</View>
			{/* </Card> */}

			<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
				<Card style={{height: Math.ceil(cardHeight * width), width: Math.ceil(cardWidth * width), ...styles.authContainer}}>
					<ScrollView>
						<Input
							id="email"
							label="Ηλεκτρονική διεύθυνση"
							keyboardType="email-address"
							required
							email
							autoCapitalize="none"
							errorText="Παρακαλούμε εισάγετε μία έγκυρη ηλεκτρονική διεύθυνση."
							onInputChange={inputChangeHandler}
							initialValue=""
						/>
						<Input
							id="password"
							label="Κωδικός"
							keyboardType="default"
							secureTextEntry
							required
							minLength={5}
							autoCapitalize="none"
							errorText="Παρακαλούμε εισάγεται ένα έγκυρο κωδικό."
							onInputChange={inputChangeHandler}
							initialValue=""
						/>
					</ScrollView>
					<View style={styles.buttonContainer}>
						{isLoading ? (
							<ActivityIndicator size="large" color={Colours.maroon} />
						) : Platform.OS === 'android' ? !formState.formIsValid ? (
							<BoldText style={styles.buttonStyle}> {isSignUp ? 'Εγγραφή' : 'Σύνδεση'} </BoldText>
						) : (
							<CustomButton
								disabled={!formState.formIsValid}
								title={isSignUp ? 'Εγγραφή' : 'Σύνδεση'}
								color={Colours.maroon}
								onPress={authHandler}
							/>
						) : (
							<Button
								disabled={!formState.formIsValid}
								title={isSignUp ? 'Εγγραφή' : 'Σύνδεση'}
								color={Colours.maroon}
								onPress={authHandler}
							/>
						)}
					</View>
					<View style={styles.buttonContainer}>
						{Platform.OS === 'android' ? (
							<CustomButton
								style={{height: Math.ceil(height * heightMultiplier), width: Math.ceil(width * widthMultiplier), ...styles.customButtonStyle}}
								title={`Αλλαγή σε ${isSignUp ? 'Σύνδεση' : 'Εγγραφή'}`}
								color={Colours.maroon}
								onPress={() => setIsSignUp(!isSignUp)}
							/>
						) : (
							<Button
								title={`Αλλαγή σε ${isSignUp ? 'Σύνδεση' : 'Εγγραφή'}`}
								color={Colours.maroon}
								onPress={() => setIsSignUp(!isSignUp)}
							/>
						)}
					</View>
				</Card>
			</KeyboardAvoidingView>
		</CustomLinearGradient>
	);
};

AuthScreen.navigationOptions = {
	headerTitle: 'Πιστοποίηση στοιχείων'
};

const styles = StyleSheet.create({
	authContainer: {
		// width: '100%',
		// maxWidth: 400,
		// maxHeight: 800,
		padding: 20
	},
	buttonStyle: {
		// height: 37,
		// width: '80%',
		marginHorizontal: 20,
		marginVertical: 10,
		paddingBottom: 7,
		paddingTop: 2,
		paddingLeft: 7,
		paddingRight: 7,
		borderRadius: 15,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		color: Colours.moccasin_light,
		backgroundColor: 'gray',

		// shadowColor: '#2AC062',
		// shadowOpacity: 0.7,
		// shadowOffset: { height: 10, width: 5 },
		// shadowRadius: 20,

		elevation: 7
	},
	// customButtonStyle: {
	// 	width: '100%',
	// },
	buttonContainer: {
		marginTop: 10
	},
	buttonContainerEntrance: {
		marginTop: 10,
		marginBottom: 20,
		zIndex: 0 // so it goes under the header when scrolling
	}
	// buttonSignup: {
	// 	width: '50%',
	// 	alignSelf: 'center'
	// }
});

export default AuthScreen;
