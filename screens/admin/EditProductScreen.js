import React, { useReducer, useEffect, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Input from '../../components/UI/Input';
import * as productsActions from '../../store/actions/products';

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

const EditProductScreen = (props) => {
	const prodId = props.navigation.getParam('productId');
	// If productId is not set (if we press the add button in UserProductScreen)
	// then editedProduct will be undifined. But that is OK.
	const editedProduct = useSelector((state) => state.products.userProducts.find((prod) => prod.id === prodId));

	const dispatch = useDispatch();

	// Rap it with useCallback to avoid infinite loop.
	const [ formState, dispatchFormState ] = useReducer(formReducer, {
		inputValues: {
			title: editedProduct ? editedProduct.title : '',
			categoryIds: editedProduct ? editedProduct.categoryIds : '',
			ownerId: editedProduct ? editedProduct.ownerId : '',
			imageUrl: editedProduct ? editedProduct.imageUrl : '',
			price: '',
			description: editedProduct ? editedProduct.description : '',
		},
		inputValidities: {
			title: editedProduct ? true : false,
			categoryIds: editedProduct ? true : false,
			ownerId: editedProduct ? true : false,
			imageUrl: editedProduct ? true : false,
			price: editedProduct ? true : false,
			description: editedProduct ? true : false,
		},
		formIsValid: editedProduct ? true : false
	});

	const submitHandler = useCallback(
		() => {
			if (!formState.formIsValid) {
				Alert.alert('Wrong input!', 'Please check the errors in the form.', [ { text: 'Okay' } ]);
				return;
			}
			if (editedProduct) {
				dispatch(
					productsActions.updateProduct(
						prodId,
						formState.inputValues.title,
						formState.inputValues.categoryIds,
						formState.inputValues.ownerId,
						formState.inputValues.imageUrl,
						formState.inputValues.description,
					)
				);
			} else {
				dispatch(
					productsActions.createProduct(
						formState.inputValues.title,
						formState.inputValues.categoryIds,
						formState.inputValues.ownerId,
						formState.inputValues.imageUrl,
						+formState.inputValues.price,
						formState.inputValues.description,
					)
				);
			}
			props.navigation.goBack();
		},
		[ dispatch, prodId, formState ]
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
	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={100}>
			<ScrollView>
				<View style={styles.form}>
				<Input
						id="categoryIds"
						label="Κατηγορίες"
						errorText="Παρακαλώ εισαγάγεται έγκυρες κατηγορίες!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.categoryIds : ''}
						// Applying two NOT operators in a row is just a handy JavaScript shortcut 
						// (not React specific) to convert a value into a boolean (if the value exists, 
						// you will get true, if the value is null, you will get false).
						initiallyValid={!!editedProduct}
						required
						autoCapitalize='none'
					/>
					<Input
						id="ownerId"
						label="Ταυτότητα διαχειριστή"
						errorText="Παρακαλώ εισαγάγεται έγκυρη ταυτότητα διαχειριστή!"
						keyboardType="default"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.ownerId : ''}
						initiallyValid={!!editedProduct}
						required
						autoCapitalize='none'

					/>
				
					<Input
						id="title"
						label="Τίτλος"
						errorText="Παρακαλώ εισαγάγεται ένα έγκυρο τίτλο!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.title : ''}
						initiallyValid={!!editedProduct}
						required
					/>
					<Input
						id="imageUrl"
						label="Σύνδεσμος Φωτογραφίας"
						errorText="Παρακαλώ εισαγάγεται ένα έγκυρο σύνδεσμο Φωτογραφίας!"
						keyboardType="default"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.imageUrl : ''}
						initiallyValid={!!editedProduct}
						required
					/>
					{editedProduct ? null : (
						<Input
							id="price"
							label="Τιμή"
							errorText="Παρακαλώ εισαγάγεται μία έγκυρη τιμή!"
							keyboardType="decimal-pad"
							returnKeyType="next"
							onInputChange={inputChangeHandler}
							required
							min={0.1}
						/>
					)}
					<Input
						id="description"
						label="Περιγραφή"
						errorText="Παρακαλώ εισαγάγεται μία έγκυρη περιγραφή!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.description : ''}
						initiallyValid={!!editedProduct}
						required
						minLength={5}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

EditProductScreen.navigationOptions = (navData) => {
	const submitFn = navData.navigation.getParam('submit');
	return {
		headerTitle: navData.navigation.getParam('productId') ? 'Επεξεργασία προϊόντος' : 'Προσθήκη προϊόντος',
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
	form: {
		margin: 20
	}
});

export default EditProductScreen;
