import React, { useState, useEffect, useCallback } from 'react';
import {
	Platform,
	View,
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
	Button,
	StyleSheet
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

const QuestionDetailScreen = (props) => {
	const { width, height } = Dimensions.get('window');
	let widthMultiplier = 0;
	let textMultiplier = 0;

	if (width <= 400 && width < 800) {
		widthMultiplier = 0.4;
		textMultiplier = 0.06;
	}
	if (width < 800 && width > 400) {
		widthMultiplier = 0.3;
		textMultiplier = 0.042;
	}
	if (width > 800) {
		widthMultiplier = 0.2;
		textMultiplier = 0.045;
	}
	const [ loadQuestionsError, setLoadQuestionsError ] = useState(); // error initially is undefined!
	const [ favError, setFavError ] = useState(); // error initially is undefined!
	const [ isLoading, setIsLoading ] = useState(false);
	const [ showAnswer, setShowAnswer ] = useState(false);

	const dispatch = useDispatch();

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
		questionId = questions[key].id;
	}

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
						σας.
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
				<View>
					<View style={styles.icon}>
						<TouchableOpacity style={styles.itemData} onPress={toggleFavoriteHandler}>
							<MaterialIcons
								name={currentQuestionIsFavorite ? 'favorite' : 'favorite-border'}
								size={Math.ceil(width * 0.09)}
								color={Colours.maroon}
							/>
						</TouchableOpacity>
					</View>
					<QuestionItem
						title={question.title}
						image={question.imageUrl}
						onSelect={() => setShowAnswer((prevState) => !prevState)}
					>
						{Platform.OS === 'android' ? (
							<View style={width < 400 ? styles.actionsSmall : styles.androidActions}>
								<View style={styles.customButton}>
									<CustomButton
										style={{ width: Math.ceil(width * widthMultiplier) }}
										title={showAnswer ? 'Απόκρυψη απάντησης' : 'Εμφάνιση απάντησης'}
										onPress={() => setShowAnswer((prevState) => !prevState)}
									/>
								</View>

								{/* <BoldText style={{ fontSize: Math.ceil(width * textMultiplier), ...styles.points }}>
									{question.points.toFixed(2)}
								</BoldText> */}
								<View style={styles.customButton}>
									<CustomButton
										style={{ width: Math.ceil(width * widthMultiplier) }}
										title="+ συλλογή"
										onPress={() => dispatch(cartActions.addToCard(question))}
									/>
								</View>
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
								{/* <BoldText style={{ fontSize: Math.ceil(width * textMultiplier), ...styles.points }}>
									{question.points.toFixed(2)}
								</BoldText> */}
								<View style={styles.button}>
									<Button
										color={Colours.gr_brown_light}
										title="+ συλλογή"
										onPress={() => dispatch(cartActions.addToCard(question))}
									/>
								</View>
							</View>
						)}
					</QuestionItem>
					{showAnswer && (
						<Card style={styles.detailItems}>
							<BoldText>{question.description}</BoldText>
						</Card>
					)}
				</View>
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
	icon: {
		alignSelf: 'center',
		margin: 2
	},
	actionsSmall: {
		// flexDirection: 'row',
		// alignSelf: 'center',
		alignItems: 'center',
		height: '42%',
		marginHorizontal: 2
	},
	androidActions: {
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'space-around',
		alignItems: 'center',
		height: '10%',
		width: '100%',
		marginHorizontal: 2
	},
	actions: {
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		height: '20%',
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
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default QuestionDetailScreen;
