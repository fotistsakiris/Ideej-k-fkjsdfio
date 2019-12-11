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
	AsyncStorage,
	Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import QuestionItem from '../../components/game/QuestionItem';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

import DimensionsForStyle from '../../components/UI/DimensionsForStyle';
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

////////////////////////////////////////////////////////
const QuestionDetailScreen = (props) => {
	const { width, height } = Dimensions.get('window');
	const widthMultiplier = DimensionsForStyle.widthMultiplier;
	const textMultiplier = DimensionsForStyle.textMultiplier;
	const cardHeight = DimensionsForStyle.cardHeight;
	const cardWidth = DimensionsForStyle.cardWidth;

	const [ email, setEmail ] = useState('');

	const [ refreshing, setRefreshing ] = useState(false);
	const [ loadQuestionsError, setLoadQuestionsError ] = useState(); // error initially is undefined!
	const [ favError, setFavError ] = useState(); // error initially is undefined!
	const [ isLoading, setIsLoading ] = useState(false);
	const [ showAnswer, setShowAnswer ] = useState(false);

	// For the timer
	const [ seconds, setSeconds ] = useState(10);
	const [ minutes, setMinutes ] = useState(0);

	// For the switches
	const [ alfaIsTrue, setAlfaIsTrue ] = useState(false); // Runs when the Switch is pressed
	const [ betaIsTrue, setBetaIsTrue ] = useState(false);
	const [ gammaIsTrue, setGammaIsTrue ] = useState(false);
	const [ deltaIsTrue, setDeltaIsTrue ] = useState(false);

	const [ choiceSave, setChoiceSave ] = useState(false);
	const [ correctChoice, setCorrectChoice ] = useState(false);
	const [ tryTimes, setTryTimes ] = useState(0);

	// For checking if previus uploaded grade is higher than this one.
	const [ userID, setUserID ] = useState('');
	// const [ userPreviousGrade, setUserPreviousGrade ] = useState(0);

	// For deleting the old data when no more questions and user restarts the game.
	const allUsersData = useSelector((state) => state.questions.allUsersData);

	const dispatch = useDispatch();

	const onRefresh = useCallback(
		() => {
			setRefreshing(true);
			setAlfaIsTrue(false);
			setBetaIsTrue(false);
			setGammaIsTrue(false);
			setDeltaIsTrue(false);
			setTryTimes(0);
			loadQuestions().then(() => {
				props.navigation.setParams({ disableSaveButton: false });
				setCorrectChoice(false);
				setShowAnswer(false);
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
			for (key in appliedAnswer) {
				if (key === 'alfa' && appliedAnswer[key] && rightChoice == 1) {
					setCorrectChoice(true);
					corChoice = true;
					props.navigation.setParams({ correctChoice: true });
				} else if (key === 'beta' && appliedAnswer[key] && rightChoice == 2) {
					setCorrectChoice(true);
					corChoice = true;
					props.navigation.setParams({ correctChoice: true });
				} else if (key === 'gamma' && appliedAnswer[key] && rightChoice == 3) {
					setCorrectChoice(true);
					corChoice = true;
					props.navigation.setParams({ correctChoice: true });
				} else if (key === 'delta' && appliedAnswer[key] && rightChoice == 4) {
					setCorrectChoice(true);
					corChoice = true;
					props.navigation.setParams({ correctChoice: true });
				}
			}
			setChoiceSave(true);

			// Code to automatically refresh app and show next question
			// if (choiceSave && corChoice && correctChoice) {
			// 	setTimeout(() => onRefresh(), 500);
			// }

			props.navigation.setParams({ choiceSave: true });
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
	useEffect(() => {
		const myInterval = setInterval(() => {
			if (seconds > 0) {
				setSeconds((seconds) => seconds - 1);
			}
			if (seconds === 0) {
				if (minutes === 0) {
					clearInterval(myInterval);
				} else {
					setMinutes((minutes) => minutes - 1);
					setSeconds(59);
				}
			}
		}, 1000);
		// Stop interval in order to get the duration to calculate the grade.
		if (!isLoading && questions.length === 0) {
			clearInterval(myInterval);
		}
		return () => {
			clearInterval(myInterval);
		};
	});

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
	/////////////////////////////////////////////////////
	// Code for when no more questions...
	let userPreviousGrade = 0;
	const getUserPrevieusGrade = () => {
		// First we get the id of the user, to get the totalPoints he has on the server
		// in All_Users_Data. Then we're going to calculate, if that or the one of this set,
		// is higher. Then, if the grade of this set is higher we delete the old one and we post
		// this one, if not we do nothing!
		
		const getUserID = async () => {
			// Note: getItem is asynchronous, so we get a promise
			const userData = await AsyncStorage.getItem('userData');

			if (!!userData) {
				// parse converts a string to an object or array
				const transformedData = JSON.parse(userData);
				let { userId } = transformedData;
				setUserID(userId);
			}
		};
		getUserID();

		let activeUserData = {};

		for (const key in allUsersData) {
			activeUserData = allUsersData[userID];
		}

		for (const key in activeUserData) {
			userPreviousGrade = activeUserData[key].totalPoints;
			// userPreviusDate = activeUserData[key].date;
		}
	};

	if ((!isLoading && questions.length === 0) || (minutes === 0 && seconds === 0)) {
		getUserPrevieusGrade();
		// Calculate grade
		const minutesDuration = minutes;
		const secondsDuration = 60 - seconds;
		const grade = (totalPoints + minutes + minutes) / 1;

		let PreviousUserDataIsLower = false;
		if (userPreviousGrade < grade) {
			PreviousUserDataIsLower = true;
		}
		
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Τέλος και τω Θεω Δόξα!</BoldText>
					<View style={styles.grade}>
						<BoldText>Βαθμολογία: {grade} </BoldText>
						<TouchableOpacity
							onPress={() => {
								Alert.alert(
									`Τρόπος βαθμολόγησης`,
									`Η βαθμολογία προκείπτει από το άθροισμα των βαθμών με τον χρόνο δια ενός αριθμού, ούτως ώστε να είναι μικρότερη του 20.`,
									[ { text: 'Εντάξει', style: 'default' } ]
								);
							}}
						>
							<MaterialIcons
								name="info-outline"
								size={Math.ceil(width * 0.04)}
								color={Colours.moccasin_light}
							/>
						</TouchableOpacity>
					</View>
					<BoldText>
						Χρόνος: {minutesDuration}:{secondsDuration}
					</BoldText>

					{Platform.OS === 'android' ? (
						<View>
							<CustomButton
								style={styles.buttonStyle}
								title="Αποθήκευση αποτελέσματος και επανεκίνηση"
								color={Colours.moccasin_light}
								onPress={() => {
									dispatch(questionsActions.deleteTotalPoints());
									dispatch(questionsActions.deleteAnsweredQuestions());
									if (PreviousUserDataIsLower) {
										dispatch(questionsActions.deletePreviousUserData());
										dispatch(questionsActions.saveDataToAllUsersData(grade, email));
									}
									props.navigation.navigate('Categories');
								}}
							/>
						</View>
					) : (
						<Button
							title="Αποθήκευση και επανεκίνηση"
							color={Colours.moccasin_light}
							onPress={() => {
								dispatch(questionsActions.deleteTotalPoints());
								dispatch(questionsActions.deleteAnsweredQuestions());
								if (PreviousUserDataIsLower) {
									dispatch(questionsActions.deletePreviousUserData());
									dispatch(questionsActions.saveDataToAllUsersData(grade, email));
								}
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
					<View style={styles.topButtonsAndIcons}>
						<BoldText>Βαθμοί: {totalPoints}</BoldText>
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
						<BoldText>
							{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
						</BoldText>
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
								{!correctChoice && choiceSave && !refreshing && tryTimes === 2 ? (
									<BoldText style={styles.tryAgain}>
										Λυπάμαι... Παρακαλώ δοκιμάστε την επόμενη!
									</BoldText>
								) : !correctChoice && choiceSave && !refreshing && tryTimes > 0 ? (
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
						{!correctChoice && choiceSave && !refreshing && tryTimes === 2 ? Platform.OS === 'android' ? (
							<View style={width < 400 ? styles.actionsSmall : styles.androidActions}>
								<View style={styles.customButton}>
									<CustomButton
										style={{ width: Math.ceil(width * widthMultiplier) }}
										title={showAnswer ? 'Απόκρυψη απάντησης' : 'Εμφάνιση απάντησης'}
										onPress={() => setShowAnswer((prevState) => !prevState)}
									/>
								</View>

								<BoldText
									style={{
										fontSize: Math.ceil(width * textMultiplier),
										...styles.difficultyLevel
									}}
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
									style={{
										fontSize: Math.ceil(width * textMultiplier),
										...styles.difficultyLevel
									}}
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
						) : null}
					</QuestionItem>

					{showAnswer && (
						<View style={styles.centered}>
							<Card
								style={{
									height: Math.ceil(cardHeight * height / 4),
									width: Math.ceil(cardWidth * width),
									...styles.centered
								}}
							>
								<BoldText>{question.answer}</BoldText>
							</Card>
						</View>
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
	const correctChoice = navigation.getParam('correctChoice');
	const choiceSave = navigation.getParam('choiceSave');
	// console.log(disable, madeAChoice, correctChoice, choiceSave);

	//
	let showSaveButton = false;
	if (!disable && !madeAChoice) {
		showSaveButton = false;
	} else if (!disable && madeAChoice) {
		showSaveButton = true;
	}

	let headerTitle = 'Καλή επιτυχία! ';
	// if (!disable && !madeAChoice ) {
	// 	headerTitle = 'Καλή επιτυχία! ' + navigation.getParam('userEmail');
	// }
	// if (correctChoice && choiceSave ) {
	// 	headerTitle = 'Χμμ...! ' + navigation.getParam('userEmail');
	// }
	// if (disable && madeAChoice) {
	// 	headerTitle = 'Δοκιμάστε την επόμενη! ' + navigation.getParam('userEmail');
	// }
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
		padding: 12
	},
	topButtonsAndIcons: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	icon: {
		// alignSelf: 'center',
		// margin: 2
	},
	multipleChoiceContainer: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '95%',
		marginVertical: 5
	},
	congrats: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '60%',
		width: '100%'
	},
	tryAgain: {
		color: 'red',
		justifyContent: 'center',
		alignItems: 'center',
		// height: '60%',
		width: '100%'
	},
	switchesSummary: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '100%'
	},
	actionsSmall: {
		alignItems: 'center',
		marginHorizontal: 2
	},
	androidActions: {
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%',
		marginHorizontal: 2
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
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
	},
	grade: {
		flexDirection: 'row'
	}
});

export default QuestionDetailScreen;
