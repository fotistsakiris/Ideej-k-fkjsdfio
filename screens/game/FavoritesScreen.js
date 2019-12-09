import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, ActivityIndicator, FlatList, Text, Dimensions, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import DimensionsForStyle from '../../components/UI/DimensionsForStyle'

import QuestionItem from '../../components/game/QuestionItem';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

import * as cartActions from '../../store/actions/cart';
import * as questionsActions from '../../store/actions/questions';

// import DefaultText from '../components/UI/DefaultText';

const FavoritesScreen = (props) => {

	const { width, height } = Dimensions.get('window');
	const widthMultiplier = DimensionsForStyle.widthMultiplier;
	const textMultiplier = DimensionsForStyle.textMultiplier;
	const cardHeight = DimensionsForStyle.cardHeight;
	const cardWidth = DimensionsForStyle.cardWidth;

	// const width = Dimensions.get('window').width; // for putting the buttons in column for small screens

	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isRefresing, setIsRefresing ] = useState(false);
	const dispatch = useDispatch();
	const userIdExists = useSelector((state) => state.auth.userId);
	const favProducts = useSelector((state) => state.questions.favoriteQuestions);

	const loadFavProducts = useCallback(
		async () => {
			setError(null);
			setIsRefresing(true);
			setIsLoading(true);
			try {
				await dispatch(questionsActions.fetchFavQuestions());
				// Load all questions... Other wise if logged in user visits the favorites
				// and then clicks to go to DetailesScreen,
				// the app can not find wich of the availabelProducts to show...
				await dispatch(questionsActions.fetchQuestions());
			} catch (err) {
				setError(err.message);
			}
			setIsRefresing(false);
			setIsLoading(false);
		},
		[ dispatch, setIsLoading, setError ]
	);

	// loadFavProducts after focusing
	useEffect(
		() => {
			const willFocusEvent = props.navigation.addListener('willFocus', loadFavProducts);
			return () => willFocusEvent.remove();
		},
		[ loadFavProducts ]
	);

	// loadFavProducts initially...
	useEffect(
		() => {
			loadFavProducts();
		},
		[ loadFavProducts ]
	);

	const selectItemHandler = (id, title) => {
		// props.navigation.pop();
		props.navigation.navigate('DetailScreen', {
			questionId: id,
		});
	};

	if (isLoading) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={Colours.maroon} />
				</View>
			</CustomLinearGradient>
		);
	}

	if (error) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>
						Σφάλμα στη διαδικασία φορτώσεως των αγαπημένων ερωτήσεων. Παρακαλούμε ελέγξτε τη σύνδεσή σας.
					</BoldText>
					{/* <Button title="Δοκιμάστε Ξανά" onPress={() => dispatch(questionsActions.fetchFavQuestions())} color={Colours.maroon} /> */}
					{Platform.OS === 'android' ? (
						<View style={styles.buttonSignup}>
							<CustomButton
								title="Δοκιμάστε Ξανά"
								color={Colours.moccasin_light}
								onPress={loadFavProducts}
							/>
						</View>
					) : (
						<Button title="Δοκιμάστε Ξανά" onPress={loadFavProducts} color={Colours.moccasin_light} />
					)}
				</View>
			</CustomLinearGradient>
		);
	}

	if (!userIdExists) {
		return (
			<CustomLinearGradient>
				<View style={styles.content}>
					<BoldText>Παρακαλούμε συνδεθείτε ή προχωρήσθε σε εγγραφή προς χρήση των αγαπημένων.</BoldText>
					<View style={styles.buttonContainerEntrance}>
						{Platform.OS === 'android' ? (
							<View style={styles.buttonSignup}>
								<CustomButton
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

	if ((!!userIdExists && !isLoading && !favProducts) || favProducts.length === 0) {
		return (
			<CustomLinearGradient>
				<View style={styles.content}>
					<BoldText>Ακόμη δεν έχετε επιλέξει αγαπημένα.</BoldText>
				</View>
			</CustomLinearGradient>
		);
	}

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
				<FlatList
					onRefresh={loadFavProducts}
					refreshing={isRefresing}
					data={favProducts}
					keyExtractor={(item) => item.id}
					renderItem={(itemData) => (
						<QuestionItem
						style={{
							height: Math.ceil(cardHeight * height / 2),
							width: Math.ceil(cardWidth * width),
						}}
							title={itemData.item.title}
							// image={itemData.item.imageUrl}
							onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}
						>
							{Platform.OS === 'android' ? (
								<View style={width < 400 ? styles.actionsSmall : styles.actions}>
									<View>
										<CustomButton
											style={{ width: Math.ceil(width * 0.3) }}
											title="Λεπτομέρειες"
											onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
										/>
									</View>
									{/* <BoldText style={{ fontSize: Math.ceil(width * 0.04), ...styles.difficultyLevel }}>
										{itemData.item.difficultyLevel.toFixed(2)}
										<Text style={styles.euro}>€</Text>
									</BoldText> */}
									<View>
										<CustomButton
											style={{ width: Math.ceil(width * 0.3) }}
											title="+ συλλογή"
											onPress={() => dispatch(cartActions.addToCard(itemData.item))}
										/>
									</View>
								</View>
							) : (
								<View style={width < 400 ? styles.actionsSmall : styles.actions}>
								
									<View style={styles.button}>
										<Button
											color={Colours.gr_brown_light}
											title="Λεπτομέρειες"
											onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
										/>
									</View>
									{/* <BoldText style={styles.difficultyLevel}>€ {itemData.item.difficultyLevel.toFixed(2)}</BoldText> */}
									<View style={styles.button}>
										<Button
											color={Colours.gr_brown_light}
											title="+ συλλογή"
											onPress={() => dispatch(cartActions.addToCard(itemData.item))}
										/>
									</View>
								</View>
							)}
						</QuestionItem>
					)}
				/>
			</View>
		</CustomLinearGradient>
	);
};

FavoritesScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Αγαπημένα',
		// Needed for side drawer navigation
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="goBack"
		// 			iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
		// 			onPress={() => navigation.pop()}
		// 		/>
		// 	</HeaderButtons>
		// ),
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
	buttonContainerEntrance: {
		marginTop: 10,
		marginBottom: 10
	},
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		padding: 20
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		margin: 12
	},
	difficultyLevel: {
		// fontSize: 18,
		color: '#888'
	},
	actionsSmall: {
		// flexDirection: 'row',
		// alignSelf: 'center',
		alignItems: 'center',
		height: '42%',
		marginHorizontal: 2
	},
	actions: {
		flexDirection: 'row',
		// alignSelf: 'center',
		justifyContent: 'space-around',
		alignItems: 'center',
		height: '18%',
		paddingHorizontal: 20
	},
	button: {
		width: '50%'
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default FavoritesScreen;
