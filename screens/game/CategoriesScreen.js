import React, { useEffect, useCallback } from 'react';
import { FlatList, View, Platform, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { CATEGORIES } from '../../data/categories';
import CategoryGridTile from '../../components/game/CategoryGridTile';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomLinearGradient from '../../components/UI/CustomLinearGradient';
import * as questionsActions from '../../store/actions/questions';

import Colours from '../../constants/Colours';

const CategoriesScreen = (props) => {
	const dispatch = useDispatch();

	const loadAllUsersData = useCallback(
		async () => {
			// setLoadQuestionsError(null);
			try {
				await dispatch(questionsActions.fetchAllUsersData());
				console.log('ok');

			} catch (err) {
				// setLoadQuestionsError(err.message);
			}
		},
		[ dispatch ]
	);

	useEffect( 
		() => {
			const getUserID = async () => {
				await dispatch(questionsActions.fetchAllUsersData());
				console.log('ok');
			};
			getUserID();
		},
		[ dispatch ]
	);

	useEffect(
		() => {
			const willFocusEvent = props.navigation.addListener('willFocus', loadAllUsersData);
			return () => willFocusEvent.remove();
		},
		[ loadAllUsersData ]
	);
	

	const renderGridItem = (itemData) => {
		return (
			<CategoryGridTile
				color={itemData.item.color}
				title={itemData.item.title}
				onSelect={() => {
					props.navigation.navigate({
						routeName: 'DetailScreen',
						params: {
							categoryId: itemData.item.id,
							categoryTitle: itemData.item.title
						}
					});
				}}
			/>
		);
	};
	// const renderGridItem = (itemData) => {
	// 	return (
	// 		<CategoryGridTile
	// 			color={itemData.item.color}
	// 			title={itemData.item.title}
	// 			onSelect={() => {
	// 				props.navigation.navigate({
	// 					routeName: 'QuestionsOverview',
	// 					params: {
	// 						categoryId: itemData.item.id,
	// 						categoryTitle: itemData.item.title
	// 					}
	// 				});
	// 			}}
	// 		/>
	// 	);
	// };

	return (
		<CustomLinearGradient>
			<View style={styles.flatListContainer}>
				<FlatList
					numColumns={2}
					keyExtractor={(item, index) => item.id}
					data={CATEGORIES}
					renderItem={renderGridItem}
				/>
			</View>
		</CustomLinearGradient>
	);
};

CategoriesScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'ΕΝ ΤΟΥΤΩ ΝΙΚΑ',
		// Needed for side drawer navigation
		headerLeft: (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					onPress={() => navigation.toggleDrawer()}
					title="Menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					size={23}
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
		// maxWidth: '100%',
		// maxHeight: '100%',
		paddingVertical: 50,
		paddingHorizontal: 20,
		paddingTop: 20
	}
});

export default CategoriesScreen;
