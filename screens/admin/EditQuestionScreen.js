import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Input from '../../components/UI/Input';
import Colours from '../../constants/Colours';
import * as questionsActions from '../../store/actions/questions';

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

const EditQuestionScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState(); // error initially is undefined!

	const questId = props.navigation.getParam('questionId');
	// If questionId is not set (if we press the add button in UserProductScreen)
	// then editedQuestion will be undifined. But that is OK.
	const editedQuestion = useSelector((state) => state.questions.userQuestions.find((quest) => quest.id === questId));

	const dispatch = useDispatch();

	// Rap it with useCallback to avoid infinite loop.
	const [ formState, dispatchFormState ] = useReducer(formReducer, {
		inputValues: {
			title: editedQuestion ? editedQuestion.title : '',
			categoryIds: editedQuestion ? editedQuestion.categoryIds : '',
			// ownerId: editedQuestion ? editedQuestion.ownerId : '',
			imageUrl: editedQuestion ? editedQuestion.imageUrl : '',
			points: editedQuestion ? editedQuestion.points.toString() : '',
			// points: '',
			description: editedQuestion ? editedQuestion.description : ''
		},
		inputValidities: {
			title: editedQuestion ? true : false,
			categoryIds: editedQuestion ? true : false,
			// ownerId: editedQuestion ? true : false,
			imageUrl: editedQuestion ? true : false,
			points: editedQuestion ? true : false,
			description: editedQuestion ? true : false
		},
		formIsValid: editedQuestion ? true : false
	});

	useEffect(
		() => {
			if (error) {
				// get the error message that we set down in the catch block
				Alert.alert('Σφάλμα στην ανανέωση δεδομένων!', error, [ { text: 'Εντάξει!' } ]);
			}
		},
		[ error ]
	);

	const submitHandler = useCallback(
		async () => {
			if (!formState.formIsValid) {
				Alert.alert('Σφάλμα στην εισαγωγή δεδομένων!', 'Παρακαλούμε συμπληρώστε όλα τα κενά ή ελέγξτε τις ειδοποιήσεις!', [
					{ text: 'Εντάξει!' }
				]);
				return;
			}
			setIsLoading(true);
			setError(null);
			try {
				if (editedQuestion) {
					await dispatch(
						questionsActions.updateProduct(
							questId,
							formState.inputValues.title,
							formState.inputValues.categoryIds,
							// formState.inputValues.ownerId,
							formState.inputValues.imageUrl,
							+formState.inputValues.points,
							formState.inputValues.description
						)
					);
				} else {
					await dispatch(
						questionsActions.createQuestion(
							formState.inputValues.title,
							formState.inputValues.categoryIds,
							// formState.inputValues.ownerId,
							formState.inputValues.imageUrl,
							+formState.inputValues.points,
							formState.inputValues.description
						)
					);
				}
				// move back only if no error!
				props.navigation.goBack();
			} catch (err) {
				setError(err.message);
			}
			setIsLoading(false);
		},
		[ dispatch, questId, formState ]
	);

	useEffect(
		() => {
			props.navigation.setParams({ submit: submitHandler });
		},
		[ submitHandler ]
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

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colours.maroon} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView style={styles.screen} behavior="padding" keyboardVerticalOffset={100}>
			<ScrollView>
				<View style={styles.form}>
					<Input
						id="categoryIds"
						label="Κατηγορίες"
						errorText="Παρακαλούμε εισαγάγεται έγκυρες κατηγορίες!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.categoryIds : ''}
						// Applying two NOT operators in a row is just a handy JavaScript shortcut
						// (not React specific) to convert a value into a boolean (if the value exists,
						// you will get true, if the value is null, you will get false).
						initiallyValid={!!editedQuestion}
						required
						autoCapitalize="none"
					/>
					{/* <Input
						id="ownerId"
						label="Ταυτότητα διαχειριστή"
						errorText="Παρακαλούμε εισαγάγεται έγκυρη ταυτότητα διαχειριστή!"
						keyboardType="default"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.ownerId : ''}
						initiallyValid={!!editedQuestion}
						required
						autoCapitalize="none"
					/> */}

					<Input
						id="title"
						label="Τίτλος"
						errorText="Παρακαλούμε εισαγάγεται ένα έγκυρο τίτλο!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.title : ''}
						initiallyValid={!!editedQuestion}
						required
					/>
					<Input
						id="imageUrl"
						label="Σύνδεσμος Φωτογραφίας"
						errorText="Παρακαλούμε εισαγάγεται ένα έγκυρο σύνδεσμο Φωτογραφίας σε μορφή  jpg, gif ή png!"
						keyboardType="default"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.imageUrl : ''}
						initiallyValid={!!editedQuestion}
						required
						imageUrl
					/>
					{/* {editedQuestion ? null : (
						<Input
							id="points"
							label="Τιμή"
							errorText="Παρακαλούμε εισαγάγεται μία έγκυρη τιμή και χρησιμοποιείτε τελεία αντί για κόμμα"
							keyboardType="number-pad"
							returnKeyType="next"
							onInputChange={inputChangeHandler}
							required
							noComma
							min={0.1}
						/>
					)} */}
					<Input
						id="points"
						label="Βαθμός"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη τιμή και χρησιμοποιείτε τελεία αντί για κόμμα"
						keyboardType="number-pad"
						returnKeyType="next"
						initialValue={editedQuestion ? editedQuestion.points.toString() : ''}
						onInputChange={inputChangeHandler}
						initiallyValid={!!editedQuestion}
						required
						noComma
						min={0.1} 
					/>
					<Input
						id="description"
						label="Περιγραφή"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη περιγραφή, οποία θα περιέχει τουλάχιστον 5 γράμματα! "
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.description : ''}
						initiallyValid={!!editedQuestion}
						required
						minLength={5}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

EditQuestionScreen.navigationOptions = ({ navigation }) => {
	const submitFn = navigation.getParam('submit');
	return {
		headerTitle: navigation.getParam('questionId') ? 'Επεξεργασία ερωτήσεως' : 'Προσθήκη ερωτήσεως',
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Save"
					iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
					onPress={submitFn}
				/>
			</HeaderButtons>
		)
	};
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colours.moccasin_light
	},
	form: {
		margin: 20
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default EditQuestionScreen;
