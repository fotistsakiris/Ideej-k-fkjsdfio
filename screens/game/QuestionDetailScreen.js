import React, { useState, useEffect, useCallback } from 'react';
import {
	Platform,
	View,
	TouchableOpacity,
	Switch,
	ActivityIndicator,
	Dimensions,
	Button,
	StyleSheet,
	Text,
	ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import QuestionItem from '../../components/game/QuestionItem';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

import CustomButton from '../../components/UI/CustomButton';
import BoldText from '../../components/UI/BoldText';
import Card from '../../components/UI/Card';
import Line from '../../components/UI/Line';

import * as cartActions from '../../store/actions/cart';
import * as questionsActions from '../../store/actions/questions';

import Colours from '../../constants/Colours';

const AnswerSwitch = (props) => {
	return (
		<View style={styles.multipleChoiceContainer}>
			<Text>{props.label}</Text>
			<Switch
				style={{ transform: [ { scaleX: 0.9 }, { scaleY: 0.6 } ] }}
				thumbColor={Colours.maroon}
				trackColor={Colours.moccasin_light}
				value={props.state}
				onValueChange={props.onChange}
			/>
		</View>
	);
};

const QuestionDetailScreen = (props) => {
	const { width, height } = Dimensions.get('window');
	let widthMultiplier = 0;
	let textMultiplier = 0;
	let cardHeight = 0;
	let cardWidth = 0;

	if (width < 400) {
		cardHeight = 0.75;
		cardWidth = 0.77;
		widthMultiplier = 0.4;
		textMultiplier = 0.06;
	}
	if (400 < width < 800) {
		cardHeight = 0.8;
		cardWidth = 0.85;
		widthMultiplier = 0.3;
		textMultiplier = 0.042;
	}
	if (width > 800) {
		cardHeight = 0.65;
		cardWidth = 0.8;
		widthMultiplier = 0.2;
		textMultiplier = 0.045;
	}
	const [ loadQuestionsError, setLoadQuestionsError ] = useState(); // error initially is undefined!
	const [ favError, setFavError ] = useState(); // error initially is undefined!
	const [ isLoading, setIsLoading ] = useState(false);
	const [ showAnswer, setShowAnswer ] = useState(false);

	// For the switches
	const [ alfaIsTrue, setAlfaIsTrue ] = useState(false); // Runs when the Switch is pressed
	const [ betaIsTrue, setBetaIsTrue ] = useState(false);
	const [ gammaIsTrue, setGammaIsTrue ] = useState(false);
	const [ deltaIsTrue, setDeltaIsTrue ] = useState(false);

	// Set the object with the all the values, alfa, beta ...
	// const [ appliedAnswerIs, setAppliedAnswerIs ] = useState(null);

	const [ choiceSave, setChoiceSave ] = useState(false);
	const [ correctChoice, setCorrectChoice ] = useState(false);

	const dispatch = useDispatch();

	// If we change one of the filters state then the saveAnswer function is memoized,
	// because of useCallback and its dependencies!
	// Then if save icon (in the headerRight) is pressed,
	// the saveAnswer function runs.
	// That means that we get a snap-shot of the state of the filters
	// and that state is saved in Redux memory with dispatch(checkAnswer).
	// The saveAnswer function runs when we press the save icon
	// because in useEffect we setted a pointer of the saveAnswer func,
	// as a parameter to the react-navigation state,
	// which then we got in the save icon and trigger it in onPress.

	// Note that useEffect first run happens when the component mounts and
	// the render method runs.
	// Then it also runs if it's dependecies change. In our case saveAnswer.
	let corChoice = false;
	const saveAnswer = useCallback(
		async () => {
			const appliedAnswer = {
				alfa: alfaIsTrue,
				beta: betaIsTrue,
				gamma: gammaIsTrue,
				delta: deltaIsTrue
			};
			console.log(appliedAnswer);
			setChoiceSave(true);
			// setAppliedAnswerIs(appliedAnswer);
			await dispatch(questionsActions.checkAnswer(appliedAnswer));
			// console.log(appliedAnswer);
			setChoiceSave(false);

			let rightChoice = 0;
			for (key in questions) {
				rightChoice = questions[key].right_choice; // for checking choice
			}
			// Getting the right choice
			console.log('rightChoice', rightChoice);
			for (key in appliedAnswer) {
				if (key === 'alfa' && appliedAnswer[key] && rightChoice == 1) {
					console.log('1', key, appliedAnswer[key], rightChoice == 1);
					setCorrectChoice(true);
					corChoice = true;
				} else if (key === 'beta' && appliedAnswer[key] && rightChoice == 2) {
					console.log('2', key, appliedAnswer[key], rightChoice == 2);
					setCorrectChoice(true);
					corChoice = true;
					console.log(key);
				} else if (key === 'gamma' && appliedAnswer[key] && rightChoice == 3) {
					setCorrectChoice(true);
					corChoice = true;
				} else if (key === 'delta' && appliedAnswer[key] && rightChoice == 4) {
					setCorrectChoice(true);
					corChoice = true;
				}
			}

			console.log('corChoice', corChoice);
		},
		[ alfaIsTrue, betaIsTrue, gammaIsTrue, deltaIsTrue, choiceSave, correctChoice, dispatch ]
	);

	if (corChoice) {
		setCorrectChoice(true);
	}
	console.log('correctChoice', correctChoice);

	useEffect(
		() => {
			props.navigation.setParams({ save: saveAnswer });
		},
		[ saveAnswer ]
	);

	// Get all the questions
	const categoryId = props.navigation.getParam('categoryId');
	let questions = useSelector((state) =>
		state.questions.availableQuestions.filter((quest) => quest.categoryIds.indexOf(categoryId) >= 0)
	);

	// If user navigates to QuestionDetailScreen from FavoritesScreen
	const questionIdFromFavoritesScreen = props.navigation.getParam('questionId');
	if (questionIdFromFavoritesScreen) {
		questions = useSelector((state) =>
			state.questions.favoriteQuestions.filter((quest) => quest.id.indexOf(questionIdFromFavoritesScreen) >= 0)
		);
	}

	const loadQuestions = useCallback(
		async () => {
			setLoadQuestionsError(null);
			try {
				await dispatch(questionsActions.fetchQuestions());
			} catch (err) {
				setLoadQuestionsError(err.message);
			}
		},
		[ dispatch, setIsLoading, setLoadQuestionsError ]
	);

	// loadQuestions after focusing
	// useEffect(
	// 	() => {
	// 		const willFocusEvent = props.navigation.addListener('willFocus', loadQuestions);
	// 		return () => willFocusEvent.remove();
	// 	},
	// 	[ loadQuestions ]
	// );

	// loadQuestions initially...
	useEffect(
		() => {
			setIsLoading(true);
			loadQuestions().then(() => setIsLoading(false));
		},
		[ loadQuestions ]
	);

	let questionId = '';
	for (key in questions) {
		questionId = questions[key].id; // for checking favorites
	}

	// Checking if current question is favorite
	const currentQuestionIsFavorite = useSelector((state) =>
		state.questions.favoriteQuestions.some((question) => question.id === questionId)
	);

	const toggleFavoriteHandler = useCallback(
		async () => {
			setFavError(null);
			try {
				await dispatch(
					questionsActions.toggleFavorite(
						questionId,
						currentQuestionIsFavorite,
						questions[questions.length - 1]
					)
				);
			} catch (err) {
				setFavError(err.message);
			}
		},
		[ dispatch, questionId, currentQuestionIsFavorite, setFavError ]
	);

	if (favError) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>
						Σφάλμα στη διαδικασία αποθήκευσης της ερωτήσεως ως αγαπημένου. Παρακαλούμε ελέγξτε τη σύνδεσή
						σας, ή συνθεθείτε στον λογαριασμό σας...
					</BoldText>

					{Platform.OS === 'android' ? (
						<CustomButton title="Δοκιμάστε Ξανά" onPress={toggleFavoriteHandler} color={Colours.maroon} />
					) : (
						<Button title="Δοκιμάστε Ξανά" onPress={toggleFavoriteHandler} color={Colours.moccasin_light} />
					)}
				</View>
			</CustomLinearGradient>
		);
	}

	if (loadQuestionsError) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>
						Σφάλμα στη διαδικασία φορτώσεως των ερωτήσεων. Παρακαλούμε ελέγξτε τη σύνδεσή σας.
					</BoldText>
					<Button title="Δοκιμάστε Ξανά" onPress={loadQuestions} color={Colours.moccasin_light} />
				</View>
			</CustomLinearGradient>
		);
	}

	if (isLoading) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={Colours.moccasin_light} />
				</View>
			</CustomLinearGradient>
		);
	}

	if (!isLoading && questions.length === 0) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Δεν βρέθηκαν ερωτήσεις στη βάση δεδομένων!</BoldText>
				</View>
			</CustomLinearGradient>
		);
	}

	const showQuestion = (question) => {
		for (key in question) {
			return (
				<ScrollView contentContainerStyle={styles.scrollViewStyle}>
					<View style={styles.icon}>
						<TouchableOpacity style={styles.itemData} onPress={toggleFavoriteHandler}>
							<MaterialIcons
								name={currentQuestionIsFavorite ? 'favorite' : 'favorite-border'}
								size={Math.ceil(width * 0.08)}
								color={Colours.maroon}
							/>
						</TouchableOpacity>
					</View>

					<QuestionItem
						style={{
							height: Math.ceil(cardHeight * height),
							width: Math.ceil(cardWidth * width)
						}}
						title={question.title}
						// image={question.imageUrl}
						// onSelect={() => setShowAnswer((prevState) => !prevState)}
					>
						{/* {corChoice ? (
							<BoldText style={styles.centered}>Συγχαρητήρια</BoldText>
						) : choiceSave && !corChoice ? (
							<BoldText style={styles.centered}>Συγκεντρώσου!!!</BoldText>
						) : null} */}
						{correctChoice ? (
							// <View style={styles.congrats}>
							<BoldText style={styles.switchesSummary}>Συγχαρητήρια</BoldText>
						) : (
							// </View>
							<View style={styles.switchesSummary}>
								<BoldText style={styles.title}>Επιλέξτε την σωστή απάντηση.</BoldText>
								<AnswerSwitch
									state={alfaIsTrue}
									onChange={(newValue) => setAlfaIsTrue(newValue)}
									label={question.choice_Alpha}
								/>
								<AnswerSwitch
									state={betaIsTrue}
									onChange={(newValue) => setBetaIsTrue(newValue)}
									label={question.choice_Beta}
								/>
								<AnswerSwitch
									state={gammaIsTrue}
									onChange={(newValue) => setGammaIsTrue(newValue)}
									label={question.choice_Gamma}
								/>
								<AnswerSwitch
									state={deltaIsTrue}
									onChange={(newValue) => setDeltaIsTrue(newValue)}
									label={question.choice_Delta}
								/>
							</View>
						)}

						{Platform.OS === 'android' ? (
							<View style={width < 400 ? styles.actionsSmall : styles.androidActions}>
								<View style={styles.customButton}>
									<CustomButton
										style={{ width: Math.ceil(width * widthMultiplier) }}
										title={showAnswer ? 'Απόκρυψη απάντησης' : 'Εμφάνιση απάντησης'}
										onPress={() => setShowAnswer((prevState) => !prevState)}
									/>
								</View>

								{/* <BoldText
									style={{ fontSize: Math.ceil(width * textMultiplier), ...styles.difficultyLevel }}
								>
									{question.difficultyLevel.toFixed(2)}
								</BoldText> */}
								{/* <View style={styles.customButton}>
									<CustomButton
										style={{ width: Math.ceil(width * widthMultiplier) }}
										title="+ συλλογή"
										onPress={() => dispatch(cartActions.addToCard(question))}
									/>
								</View> */}
							</View>
						) : (
							<View style={styles.actions}>
								<View style={styles.button}>
									<Button
										color={Colours.gr_brown_light}
										title={showAnswer ? 'Απόκρυψη απάντησης' : 'Εμφάνιση απάντησης'}
										onPress={() => setShowAnswer((prevState) => !prevState)}
									/>
								</View>
								{/* <BoldText
									style={{ fontSize: Math.ceil(width * textMultiplier), ...styles.difficultyLevel }}
								>
									{question.difficultyLevel.toFixed(2)}
								</BoldText> */}
								{/* <View style={styles.button}>
									<Button
										color={Colours.gr_brown_light}
										title="+ συλλογή"
										onPress={() => dispatch(cartActions.addToCard(question))}
									/>
								</View> */}
							</View>
						)}
					</QuestionItem>
						{showAnswer && (
							<Card
								style={{
									height: Math.ceil(cardHeight * height / 4),
									width: Math.ceil(cardWidth * width),
									...styles.centered
								}}
							>
								<BoldText>{question.answer}</BoldText>
							</Card>
						)}
				</ScrollView>
			);
		}
	};

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>{showQuestion(questions[questions.length - 1])}</View>
		</CustomLinearGradient>
	);
};

QuestionDetailScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Καλή επιτυχία!',
		// Needed for side drawer navigation
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="goBack"
					iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
					onPress={() => navigation.goBack()}
				/>
			</HeaderButtons>
		),
		headerRight: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item title="Save" iconName="ios-save" onPress={navigation.getParam('save')} />
			</HeaderButtons>
		)
		// headerRight: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="cart"
		// 			iconName={Platform.OS === 'android' ? 'md-albums' : 'ios-albums'}
		// 			onPress={() => navigation.navigate({ routeName: 'Cart' })}
		// 		/>
		// 	</HeaderButtons>
		// )
	};
};

const styles = StyleSheet.create({
	scrollViewStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	},
	icon: {
		alignSelf: 'center',
		margin: 2
	},
	multipleChoiceContainer: {
		// flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '95%',
		marginVertical: 5
	},
	congrats: {
		// flex: 1,
		// height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		height: '60%',
		width: '100%'
	},
	switchesSummary: {
		// flexDirection: 'row',
		// alignSelf: 'center',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		// height: '60%',
		width: '100%'
		// marginHorizontal: 2
	},
	// switches: {
	// 	flexDirection: 'row',
	// 	// alignSelf: 'center',
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// 	// height: '20%',
	// 	width: '100%',
	// 	marginHorizontal: 2
	// },
	actionsSmall: {
		// flexDirection: 'row',
		// alignSelf: 'center',
		alignItems: 'center',
		// height: '42%',
		marginHorizontal: 2
	},
	androidActions: {
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'space-around',
		alignItems: 'center',
		// height: '10%',
		width: '100%',
		marginHorizontal: 2
	},
	actions: {
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		// height: '10%',
		width: '100%',
		marginHorizontal: 2
	},
	customButton: {
		marginHorizontal: -7,
		marginVertical: -2
	},
	button: {
		width: '40%',
		marginLeft: 10
	},
	showAnswer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default QuestionDetailScreen;
