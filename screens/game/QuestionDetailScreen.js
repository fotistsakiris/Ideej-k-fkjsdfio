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
	ScrollView,
	RefreshControl,
	AsyncStorage
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

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
				style={{ transform: [ { scaleX: 1 }, { scaleY: 0.7 } ] }}
				thumbColor={Colours.maroon}
				trackColor={Colours.moccasin_light}
				value={props.state}
				onValueChange={props.onChange}
				disabled={props.disabled}
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
		cardHeight = 0.65;
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
	const [ email, setEmail ] = useState('');

	const [ refreshing, setRefreshing ] = useState(false);
	const [ loadQuestionsError, setLoadQuestionsError ] = useState(); // error initially is undefined!
	const [ favError, setFavError ] = useState(); // error initially is undefined!
	const [ isLoading, setIsLoading ] = useState(false);
	const [ showAnswer, setShowAnswer ] = useState(false);

	// For the switches
	const [ alfaIsTrue, setAlfaIsTrue ] = useState(false); // Runs when the Switch is pressed
	const [ betaIsTrue, setBetaIsTrue ] = useState(false);
	const [ gammaIsTrue, setGammaIsTrue ] = useState(false);
	const [ deltaIsTrue, setDeltaIsTrue ] = useState(false);

	const [ choiceSave, setChoiceSave ] = useState(false);
	const [ correctChoice, setCorrectChoice ] = useState(false);
	const [ tryTimes, setTryTimes ] = useState(0);

	const dispatch = useDispatch();

	const onRefresh = useCallback(
		() => {
			props.navigation.setParams({ disableSaveButton: tryTimes === 1 });
			setRefreshing(true);
			setCorrectChoice(false);
			setAlfaIsTrue(false);
			setBetaIsTrue(false);
			setGammaIsTrue(false);
			setDeltaIsTrue(false);
			setTryTimes(0);
			loadQuestions().then(() => {
				setRefreshing(false);
			});
		},
		[ refreshing ]
	);

	const totalPoints = useSelector((state) => state.questions.totalPoints);

	// Get all the questions
	const categoryId = props.navigation.getParam('categoryId');
	let questions = useSelector((state) =>
		state.questions.availableQuestions.filter((quest) => quest.categoryIds.indexOf(categoryId) >= 0)
	);

	// const userQuestions = useSelector(state => state.questions.userAnsweredQuestions.filter(quest => quest.id))

	const selectedQuestion = questions[questions.length - 1];

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
			let rightChoice = 0;
			for (key in questions) {
				rightChoice = questions[key].right_choice; // for checking choice
			}
			// Getting the right choice
			// console.log('rightChoice', rightChoice);
			for (key in appliedAnswer) {
				if (key === 'alfa' && appliedAnswer[key] && rightChoice == 1) {
					// console.log('1', key, appliedAnswer[key], rightChoice == 1);
					setCorrectChoice(true);
					corChoice = true;
				} else if (key === 'beta' && appliedAnswer[key] && rightChoice == 2) {
					// console.log('2', key, appliedAnswer[key], rightChoice == 2);
					setCorrectChoice(true);
					corChoice = true;
					// console.log(key);
				} else if (key === 'gamma' && appliedAnswer[key] && rightChoice == 3) {
					setCorrectChoice(true);
					corChoice = true;
				} else if (key === 'delta' && appliedAnswer[key] && rightChoice == 4) {
					setCorrectChoice(true);
					corChoice = true;
				}
			}
			setChoiceSave(true);
			setTryTimes((prevState) => prevState + 1);
			const difficultyLevel = selectedQuestion.difficultyLevel;

			props.navigation.setParams({ disableSaveButton: tryTimes === 1 });
			await dispatch(questionsActions.checkAnswer(selectedQuestion, corChoice, difficultyLevel, totalPoints));
			setTimeout(() => setChoiceSave(false), 2000);

			// console.log('corChoice', corChoice);
		},
		[ alfaIsTrue, betaIsTrue, gammaIsTrue, deltaIsTrue, choiceSave, correctChoice, dispatch ]
	);

	// Check why do we need to do this hack!
	// Why setCorrectChoice(true); does not work in the if statements above...?
	if (corChoice) {
		setCorrectChoice(true);
	}
	// console.log('correctChoice', correctChoice);

	useEffect(
		() => {
			props.navigation.setParams({ save: saveAnswer });
		},
		[ saveAnswer ]
	);

	// For hiding/showing the save button
	useEffect(
		() => {
			if (alfaIsTrue || betaIsTrue || gammaIsTrue || deltaIsTrue) {
				props.navigation.setParams({ madeAChoice: true });
			} else {
				props.navigation.setParams({ madeAChoice: false });
			}
		},
		[ alfaIsTrue, betaIsTrue, gammaIsTrue, deltaIsTrue ]
	);

	useEffect(() => {
		const getEmail = async () => { 
			// Note: getItem is asynchronous, so we get a promise

			const userData = await AsyncStorage.getItem('userData');
			if (userData) {
				// parse converts a string to an object or array
				const transformedData = JSON.parse(userData);
				const { userEmail } = transformedData;
				setEmail(userEmail);
				props.navigation.setParams({ userEmail: userEmail });
			}
		};
		getEmail();
	}, []);


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
	useEffect(
		() => {
			const willFocusEvent = props.navigation.addListener('willFocus', loadQuestions);
			return () => willFocusEvent.remove();
		},
		[ loadQuestions ]
	);

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
					{Platform.OS === 'android' ? (
						<CustomButton title="Δοκιμάστε Ξανά" onPress={loadQuestions} color={Colours.maroon} />
					) : (
						<Button title="Δοκιμάστε Ξανά" onPress={loadQuestions} color={Colours.moccasin_light} />
					)}
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
					<BoldText>Τέλος και τω Θεω Δόξα!</BoldText>
					<BoldText>Βαθμολογία: {totalPoints}</BoldText>
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
				</View>
			</CustomLinearGradient>
		);
	}

	const showQuestion = (question) => {
		for (key in question) {
			return (
				<ScrollView
					contentContainerStyle={styles.scrollViewStyle}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				>
					<View style={styles.topButtonsAndIcon}>
						<BoldText>Βαθμολογία: {totalPoints}</BoldText>
						<TouchableOpacity onPress={onRefresh}>
							<MaterialIcons name="refresh" size={Math.ceil(width * 0.065)} color={Colours.maroon} />
						</TouchableOpacity>
						<TouchableOpacity onPress={toggleFavoriteHandler}>
							<MaterialIcons
								name={currentQuestionIsFavorite ? 'favorite' : 'favorite-border'}
								size={Math.ceil(width * 0.065)}
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
						{correctChoice ? (
							<BoldText style={styles.switchesSummary}>Συγχαρητήρια</BoldText>
						) : (
							<View style={styles.switchesSummary}>
								{!correctChoice && choiceSave && tryTimes == 2 ? (
									<BoldText style={styles.tryAgain}>
										Λυπάμαι... Παρακαλώ δοκιμάστε την επόμενη!
									</BoldText>
								) : !correctChoice && choiceSave ? (
									<BoldText style={styles.tryAgain}>
										Δεν επιλέξατε την σωστή απάντηση. Παρακαλώ δοκιμάστε ξανά!
									</BoldText>
								) : (
									<BoldText style={styles.title}>Επιλέξτε την σωστή απάντηση.</BoldText>
								)}
								<AnswerSwitch
									state={alfaIsTrue}
									onChange={(newValue) => setAlfaIsTrue(newValue)}
									label={question.choice_Alpha}
									disabled={betaIsTrue || gammaIsTrue || deltaIsTrue}
									// disabled={true}
								/>
								<AnswerSwitch
									state={betaIsTrue}
									onChange={(newValue) => setBetaIsTrue(newValue)}
									label={question.choice_Beta}
									disabled={alfaIsTrue || gammaIsTrue || deltaIsTrue}
								/>
								<AnswerSwitch
									state={gammaIsTrue}
									onChange={(newValue) => setGammaIsTrue(newValue)}
									label={question.choice_Gamma}
									disabled={alfaIsTrue || betaIsTrue || deltaIsTrue}
								/>
								<AnswerSwitch
									state={deltaIsTrue}
									onChange={(newValue) => setDeltaIsTrue(newValue)}
									label={question.choice_Delta}
									disabled={alfaIsTrue || betaIsTrue || gammaIsTrue}
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

								<BoldText
									style={{ fontSize: Math.ceil(width * textMultiplier), ...styles.difficultyLevel }}
								>
									Βαθμοί: {question.difficultyLevel}
								</BoldText>
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
								<BoldText
									style={{ fontSize: Math.ceil(width * textMultiplier), ...styles.difficultyLevel }}
								>
									Βαθμοί: {question.difficultyLevel}
								</BoldText>
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
			<View style={styles.flatListContainer}>{showQuestion(selectedQuestion)}</View>
		</CustomLinearGradient>
	);
};

QuestionDetailScreen.navigationOptions = ({ navigation }) => {
	const disable = navigation.getParam('disableSaveButton');
	const madeAChoice = navigation.getParam('madeAChoice');

	let showSaveButton = false;
	if (!disable && !madeAChoice) {
		showSaveButton = false;
	} else if (!disable && madeAChoice) {
		showSaveButton = true;
	}

	let headerTitle = 'Καλή επιτυχία! ' + navigation.getParam('userEmail');
	if (disable) {
		headerTitle = 'Δοκιμάστε την επόμενη! ' + navigation.getParam('userEmail');
	}
	return {
		headerTitle: headerTitle,
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
				{showSaveButton ? (
					<Item title="Save" iconName="ios-save" onPress={navigation.getParam('save')} />
				) : null}
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
		// alignItems: 'center',
		padding: 12
	},
	topButtonsAndIcon: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	icon: {
		// alignSelf: 'center',
		// margin: 2
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
	tryAgain: {
		color: 'red',
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
		// alignSelf: 'center',
		justifyContent: 'space-around',
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
