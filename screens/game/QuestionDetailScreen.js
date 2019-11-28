import React, { useState, useCallback } from 'react';
import {
	Platform,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Image,
	Dimensions,
	Button,
	StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';

import CustomButton from '../../components/UI/CustomButton';
import BoldText from '../../components/UI/BoldText';
import Line from '../../components/UI/Line';

import * as cartActions from '../../store/actions/cart';
import * as questionsActions from '../../store/actions/questions';

import Colours from '../../constants/Colours';

const QuestionDetailScreen = (props) => {
	const { width, height } = Dimensions.get('window');
	let textMultiplier = 0;

	if (width <= 400 && width < 800) {
		textMultiplier = 0.06;
	}
	if (width < 800 && width > 400) {
		textMultiplier = 0.055;
	}
	if (width > 800) {
		textMultiplier = 0.04;
	}
	const [ error, setError ] = useState(); // error initially is undefined!

	const dispatch = useDispatch();

	const questionId = props.navigation.getParam('questionId');
	const selectedQuestion = useSelector((state) =>
		state.questions.availableQuestions.find((quest) => quest.id === questionId)
	);

	const currentQuestionIsFavorite = useSelector((state) =>
		state.questions.favoriteQuestions.some((question) => question.id === questionId)
	);

	const toggleFavoriteHandler = useCallback(
		async () => {
			setError(null);
			try {
				await dispatch(
					questionsActions.toggleFavorite(questionId, currentQuestionIsFavorite, selectedQuestion)
				);
			} catch (err) {
				setError(err.message);
			}
		},
		[ dispatch, questionId, currentQuestionIsFavorite ]
	);

	if (error) {
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

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
				<ScrollView>
					<View style={styles.icon}>
						<TouchableOpacity style={styles.itemData} onPress={toggleFavoriteHandler}>
							<MaterialIcons
								name={currentQuestionIsFavorite ? 'favorite' : 'favorite-border'}
								size={Math.ceil(width * 0.09)}
								color={Colours.maroon}
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.centerImage}>
						<Image
							style={{ width: Math.ceil(width * 0.8), height: Math.ceil(height * 0.5), ...styles.image }}
							source={{ uri: selectedQuestion.imageUrl }}
						/>
					</View>
					<View style={styles.textContainer}>
						<BoldText
							style={{ fontSize: Math.ceil(textMultiplier * width), ...styles.title }}
							numberOfLines={3}
						>
							{selectedQuestion.title}
						</BoldText>
						{/* <BoldText style={styles.title}>{props.title}</BoldText> */}
						<Line />
					</View>
					{Platform.OS === 'android' ? (
						<View style={styles.button}>
							<CustomButton
								style={Colours.maroon}
								title="+ συλλογή"
								onPress={() => dispatch(cartActions.addToCard(selectedQuestion))}
							/>
						</View>
					) : (
						<View style={styles.button}>
							<Button
								color={Colours.moccasin_light}
								title="+ συλλογή"
								onPress={() => dispatch(cartActions.addToCard(selectedQuestion))}
							/>
						</View>
					)}

					<BoldText style={{ fontSize: Math.ceil(width * 0.04), ...styles.points }}>
						{selectedQuestion.points.toFixed(2)}
						<Text style={styles.euro}> €</Text>
					</BoldText>
					<Text style={{ fontSize: Math.ceil(width * 0.04), ...styles.description }}>
						{selectedQuestion.description}
					</Text>
				</ScrollView>
			</View>
		</CustomLinearGradient>
	);
};

QuestionDetailScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('questionTitle'),
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
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		padding: 20
	},
	icon: {
		alignSelf: 'center',
		margin: 2
	},
	centerImage: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		// width: '100%',
		// height: 300,
		resizeMode: 'contain',
		margin: 2
	},
	textContainer: {
		alignItems: 'center',
		height: '15%',
		padding: 2
	},
	points: {
		// fontSize: 18,
		color: Colours.moccasin_light,
		textAlign: 'center',
		marginVertical: 2
	},
	euro: {
		fontSize: 14,
		color: Colours.moccasin_light
	},
	description: {
		// fontSize: 20,
		textAlign: 'justify',
		padding: 20,
		color: Colours.moccasin_light
	},
	button: {
		marginHorizontal: 5,
		alignSelf: 'center'
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default QuestionDetailScreen;
