import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	Text,
	Button,
	FlatList,
	StyleSheet,
	SafeAreaView,
	Alert,
	ActivityIndicator,
	Platform,
	Dimensions
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomButton from '../../components/UI/CustomButton';
import QuestionItem from '../../components/game/QuestionItem';
import BoldText from '../../components/UI/BoldText';
import Colours from '../../constants/Colours';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
import * as questionsActions from '../../store/actions/questions';

const AdminQuestionsOverview = (props) => {
	const width = Dimensions.get('window').width; // for putting the buttons in column for small screens

	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState(); // error initially is undefined!
	const [ isRefresing, setIsRefresing ] = useState(false);

	const dispatch = useDispatch();
	// const userQuestions = useSelector((state) => state.questions.userQuestions);
	const productsInCart = useSelector((state) => state.cart.items);

	const AdminCategoryId = props.navigation.getParam('AdminCategoryId');
	const userQuestions = useSelector((state) =>
		state.questions.userQuestions.filter((quest) => quest.categoryIds.indexOf(AdminCategoryId) >= 0)
	);

	const loadProducts = useCallback(
		async () => {
			setError(null);
			setIsRefresing(true);
			try {
				await dispatch(questionsActions.fetchQuestions());
			} catch (err) {
				setError(err.message);
			}
			setIsRefresing(false);
		},
		[ dispatch, setIsLoading, setError ]
	);

	// loadProducts after focusing
	useEffect(
		() => {
			const willFocusEvent = props.navigation.addListener('willFocus', loadProducts);
			return () => willFocusEvent.remove();
		},
		[ loadProducts ]
	);

	// loadProducts initially...

	useEffect(
		() => {
			setIsLoading(true);
			loadProducts().then(() => setIsLoading(false));
		},
		[ dispatch, loadProducts ]
	);
	const editQuestionHandler = (id) => {
		props.navigation.navigate('EditQuestion', { questionId: id });
	};

	const deleteHandler = (id) => {
		if (Object.keys(productsInCart).length === 0) {
			Alert.alert('Διαγραφή ερωτήσεως!', 'Θέλετε να διαγράψετε την ερώτηση;', [
				{ text: 'ΟΧΙ', style: 'default' },
				{ text: 'ΝΑΙ', style: 'destructive', onPress: () => dispatch(questionsActions.deleteQuestion(id)) }
			]);
		} else {
			for (const key in productsInCart) {
				if (key === id) {
					Alert.alert(
						'Διαγραφή Ερωτήσεως!',
						'Η ερώτηση είναι αυτή τη στιγμή σε ενεργό παιχνίδι. Παρακαλούμε περιμένετε να τελιώσει το παιχνίδι και δοκιμάστε αργότερα. Ευχαριστούμε!',
						[ { text: 'Εντάξει', style: 'default' } ]
					);
				} else {
				}
			}
		}
	};

	if (error) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Σφάλμα στη διαδικασία φορτώσεως των ερωτήσεων. Παρακαλούμε ελέγξτε τη σύνδεσή σας.</BoldText>
					{Platform.OS === 'android' ? (
						<CustomButton title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.moccasin_light} />
					) : (
						<Button title="Δοκιμάστε Ξανά" onPress={loadProducts} color={Colours.moccasin_light} />
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

	if (!isLoading && userQuestions.length === 0) {
		return (
			<CustomLinearGradient>
				<View style={styles.centered}>
					<BoldText>Δεν βρέθηκαν ερωτήσεις στη βάση δεδομένων!</BoldText>
					{Platform.OS === 'android' ? (
						<CustomButton
							title="Διαχειριστής"
							onPress={() => props.navigation.navigate('AdminCategories')}
							color={Colours.moccasin_light}
						/>
					) : (
						<Button
							title="Διαχειριστής"
							onPress={() => props.navigation.navigate('AdminCategories')}
							color={Colours.moccasin_light}
						/>
					)}
				</View>
			</CustomLinearGradient>
		);
	}

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
				<SafeAreaView style={{ flex: 1 }}>
					<FlatList
						onRefresh={loadProducts}
						refreshing={isRefresing}
						data={userQuestions}
						keyExtractor={(item) => item.id}
						renderItem={(itemData) => (
							<QuestionItem
								image={itemData.item.imageUrl}
								title={itemData.item.title}
								onSelect={() => editQuestionHandler(itemData.item.id)}
							>
								{Platform.OS === 'android' ? (
								<View style={width < 400 ? styles.actionsSmall : styles.actions}>
									<View style={styles.customButton}>
											<CustomButton
											style={{width: Math.ceil(width * 0.3)}}
												title="Επεξεργασία"
												onPress={() => editQuestionHandler(itemData.item.id)}
											/>
										</View>
										<BoldText style={{fontSize: Math.ceil(width * 0.04), ...styles.points}}>
											{itemData.item.points.toFixed(2)}
											
										</BoldText>
										<View style={styles.customButton}>
											<CustomButton
											style={{width: Math.ceil(width * 0.3)}}
												title="Διαγραφή"
												onPress={deleteHandler.bind(this, itemData.item.id)}
											/>
										</View>
									</View>
								) : (
									<View style={styles.actions}>
										<View style={styles.button}>
											<Button
												color={Colours.gr_brown_light}
												title="Επεξεργασία"
												onPress={() => editQuestionHandler(itemData.item.id)}
											/>
										</View>
										<BoldText style={styles.points}>
											{itemData.item.points.toFixed(2)}
											
										</BoldText>
										{/* <BoldText style={styles.points}>€ {itemData.item.points}</BoldText> */}
										<View style={styles.button}>
											<Button
												color={Colours.gr_brown_light}
												title="Διαγραφή"
												onPress={() => dispatch(deleteHandler.bind(this, itemData.item.id))}
											/>
										</View>
									</View>
								)}
								{/* <Button color={Colours.maroon} title="Edit" onPress={() => editQuestionHandler(itemData.item.id)} />
					<Button
						color={Colours.maroon}
						title="Delete"
						onPress={deleteHandler.bind(this, itemData.item.id)}
					/> */}
							</QuestionItem>
						)}
					/>
				</SafeAreaView>
			</View>
		</CustomLinearGradient>
	);
};

AdminQuestionsOverview.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.getParam('AdminCategoryTitle'),
		// headerTitle: 'Τα ερωτήσεις σας',
		// For side drawer navigation only.
		// headerLeft: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="card"
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
					title="create"
					iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
					onPress={() => navigation.navigate('EditQuestion')}
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
	points: {
		// fontSize: 18,
		color: '#888'
		// marginHorizontal: 1
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
	actions: {
		flexDirection: 'row',
		// alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'space-around',
		height: '18%',
		marginHorizontal: 2
	},
	customButton: {
		marginHorizontal: -7,
		marginVertical: -2
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

export default AdminQuestionsOverview;
