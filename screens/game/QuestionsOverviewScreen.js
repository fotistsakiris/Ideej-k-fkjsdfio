import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, Dimensions, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import QuestionItem from '../../components/game/QuestionItem';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomButton from '../../components/UI/CustomButton';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';

import * as cartActions from '../../store/actions/cart';
import * as questionsActions from '../../store/actions/questions';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

const QuestionsOverviewScreen = (props) => {
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
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState(); // error initially is undefined!
	const dispatch = useDispatch();

	const categoryId = props.navigation.getParam('categoryId');
	const questions = useSelector((state) =>
		state.questions.availableQuestions.filter((quest) => quest.categoryIds.indexOf(categoryId) >= 0)
	);
	const chosenQuestion = questions[Math.floor(Math.random() * questions.length)];

	const loadQuestions = useCallback(
		async () => {
			setError(null);
			try {
				await dispatch(questionsActions.fetchQuestions());
			} catch (err) {
				setError(err.message);
			}
		},
		[ dispatch, setIsLoading, setError ]
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
		[ dispatch, loadQuestions ]
	);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate('DetailScreen', {
			questionId: id,
			questionTitle: title
		});
	};

	if (error) {
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

	if (!isLoading && questions.lenght === 0) {
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
				<QuestionItem
					title={chosenQuestion.title}
					image={chosenQuestion.imageUrl}
					onSelect={() => selectItemHandler(chosenQuestion.id, chosenQuestion.title)}
				>
					{Platform.OS === 'android' ? (
						<View style={width < 400 ? styles.actionsSmall : styles.androidActions}>
							<View style={styles.customButton}>
								<CustomButton
									style={{ width: Math.ceil(width * widthMultiplier) }}
									title="Απάντηση"
									onPress={() => selectItemHandler(chosenQuestion.id, chosenQuestion.title)}
								/>
							</View>

							<BoldText style={{ fontSize: Math.ceil(width * textMultiplier), ...styles.difficultyLevel }}>
								{chosenQuestion.difficultyLevel.toFixed(2)}
							</BoldText>
							<View style={styles.customButton}>
								<CustomButton
									style={{ width: Math.ceil(width * widthMultiplier) }}
									title="+ συλλογή"
									onPress={() => dispatch(cartActions.addToCard(chosenQuestion))}
								/>
							</View>
						</View>
					) : (
						<View style={styles.actions}>
							<View style={styles.button}>
								<Button
									color={Colours.gr_brown_light}
									title="Απάντηση"
									onPress={() => selectItemHandler(chosenQuestion.id, chosenQuestion.title)}
								/>
							</View>
							<BoldText style={{ fontSize: Math.ceil(width * textMultiplier), ...styles.difficultyLevel }}>
								{chosenQuestion.difficultyLevel.toFixed(2)}
							</BoldText>
							<View style={styles.button}>
								<Button
									color={Colours.gr_brown_light}
									title="+ συλλογή"
									onPress={() => dispatch(cartActions.addToCard(chosenQuestion))}
								/>
							</View>
						</View>
					)}
				</QuestionItem>
			);
		}
	};

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
			{showQuestion(questions)}
			</View>
		</CustomLinearGradient>
	);
	
};

QuestionsOverviewScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('AdminCategoryTitle'),
		// Needed for side drawer navigation
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="menu"
		// 			iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
		// 			onPress={() => navigation.toggleDrawer()}
		// 		/>
		// 	</HeaderButtons>
		// ),
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
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		// maxHeight: '100%',
		padding: 20
	},
	difficultyLevel: {
		// fontSize: 18,
		color: '#888',
		alignSelf: 'center',
		// justifyContent: 'center',
		// alignContent: 'center'
		// marginHorizontal: 5,
		marginLeft: 6
	},
	euro: {
		// fontSize: 14,
		color: '#888'
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
		height: '10%',
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
export default QuestionsOverviewScreen;
