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
			categoryIds: editedQuestion ? editedQuestion.categoryIds : '',
			title: editedQuestion ? editedQuestion.title : '',
			// ownerId: editedQuestion ? editedQuestion.ownerId : '',
			// imageUrl: editedQuestion ? editedQuestion.imageUrl : '',
			difficultyLevel: editedQuestion ? editedQuestion.difficultyLevel.toString() : '',
			// difficultyLevel: '',
			answer: editedQuestion ? editedQuestion.answer : '',
			choice_Alpha: editedQuestion ? editedQuestion.choice_Alpha : '',
			choice_Beta: editedQuestion ? editedQuestion.choice_Beta : '',
			choice_Gamma: editedQuestion ? editedQuestion.choice_Gamma : '',
			choice_Delta: editedQuestion ? editedQuestion.choice_Delta : '',
			right_choice: editedQuestion ? editedQuestion.right_choice : ''
		},
		inputValidities: {
			categoryIds: editedQuestion ? true : false,
			title: editedQuestion ? true : false,
			difficultyLevel: editedQuestion ? true : false,
			// ownerId: editedQuestion ? true : false,
			// imageUrl: editedQuestion ? true : false,
			answer: editedQuestion ? true : false,
			choice_Alpha: editedQuestion ? true : false,
			choice_Beta: editedQuestion ? true : false,
			choice_Gamma: editedQuestion ? true : false,
			choice_Delta: editedQuestion ? true : false,
			right_choice: editedQuestion ? true : false
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
				Alert.alert(
					'Σφάλμα στην εισαγωγή δεδομένων!',
					'Παρακαλούμε συμπληρώστε όλα τα κενά ή ελέγξτε τις ειδοποιήσεις!',
					[ { text: 'Εντάξει!' } ]
				);
				return;
			}
			setIsLoading(true);
			setError(null);
			try {
				if (editedQuestion) {
					await dispatch(
						questionsActions.updateQuestion(
							questId,
							formState.inputValues.title,
							formState.inputValues.categoryIds,
							// formState.inputValues.ownerId,
							// formState.inputValues.imageUrl,
							+formState.inputValues.difficultyLevel,
							formState.inputValues.answer,
							formState.inputValues.choice_Alpha,
							formState.inputValues.choice_Beta,
							formState.inputValues.choice_Gamma,
							formState.inputValues.choice_Delta,
							formState.inputValues.right_choice
						)
					);
				} else {
					await dispatch(
						questionsActions.createQuestion(
							formState.inputValues.title,
							formState.inputValues.categoryIds,
							// formState.inputValues.ownerId,
							// formState.inputValues.imageUrl,
							+formState.inputValues.difficultyLevel,
							formState.inputValues.answer,
							formState.inputValues.choice_Alpha,
							formState.inputValues.choice_Beta,
							formState.inputValues.choice_Gamma,
							formState.inputValues.choice_Delta,
							formState.inputValues.right_choice
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
				input: inputIdentifier,
				value: inputValue,
				isValid: inputValidity
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
						<Input
						id="difficultyLevel"
						label="Βαθμός δυσκολίας"
						errorText="Παρακαλούμε εισαγάγεται ένα έγκυρο βαθμό δυσκολίας και χρησιμοποιείτε τελεία αντί για κόμμα"
						keyboardType="number-pad"
						returnKeyType="next"
						initialValue={editedQuestion ? editedQuestion.difficultyLevel.toString() : ''}
						onInputChange={inputChangeHandler}
						initiallyValid={!!editedQuestion}
						required
						noComma
						min={0.1}
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
						label="Ερώτηση"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη ερώτηση!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.title : ''}
						initiallyValid={!!editedQuestion}
						required
					/>
					{/* <Input
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
					/> */}
				
					<Input
						id="answer"
						label="Απάντηση"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη απάντηση, η οποία θα περιέχει τουλάχιστον 5 γράμματα! "
						keyboardType="default"
						autoCapitalize="sentences"
						returnKeyType="next"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.answer : ''}
						initiallyValid={!!editedQuestion}
						required
						minLength={1}
					/>
					<Input
						id="choice_Alpha"
						label="Επιλογή Α"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη επιλογή, η οποία θα περιέχει τουλάχιστον 5 γράμματα! "
						keyboardType="default"
						autoCapitalize="sentences"
						returnKeyType="next"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.choice_Alpha : ''}
						initiallyValid={!!editedQuestion}
						required
						minLength={1}
					/>
					<Input
						id="choice_Beta"
						label="Επιλογή Β"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη επιλογή, η οποία θα περιέχει τουλάχιστον 5 γράμματα! "
						keyboardType="default"
						autoCapitalize="sentences"
						returnKeyType="next"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.choice_Beta : ''}
						initiallyValid={!!editedQuestion}
						required
						minLength={1}
					/>
					<Input
						id="choice_Gamma"
						label="Επιλογή Γ"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη επιλογή, η οποία θα περιέχει τουλάχιστον 5 γράμματα! "
						keyboardType="default"
						autoCapitalize="sentences"
						returnKeyType="next"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.choice_Gamma : ''}
						initiallyValid={!!editedQuestion}
						required
						minLength={1}
					/>
					<Input
						id="choice_Delta"
						label="Επιλογή Δ"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη επιλογή, η οποία θα περιέχει τουλάχιστον 5 γράμματα! "
						keyboardType="default"
						autoCapitalize="sentences"
						returnKeyType="next"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.choice_Delta : ''}
						initiallyValid={!!editedQuestion}
						required
						minLength={1}
					/>
					<Input
						id="right_choice"
						label="Σωστή Επιλογή"
						errorText="Παρακαλούμε εισαγάγεται μία έγκυρη επιλογή, η οποία θα περιέχει τουλάχιστον 5 γράμματα! "
						keyboardType="number-pad"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedQuestion ? editedQuestion.right_choice : ''}
						initiallyValid={!!editedQuestion}
						required
						noComma
						min={0.1}
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
