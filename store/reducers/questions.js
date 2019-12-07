import {
	TOGGLE_FAVORITE,
	DELETE_QUESTION,
	CREATE_QUESTION,
	UPDATE_QUESTION,
	SET_QUESTIONS,
	CHECK_ANSWER,
	FETCH_USER_TOTAL_POINTS,
	DELETE_ANSWERED_QUESTIONS,
	SET_FAVORITES,
} from '../actions/questions';
import Question from '../../models/question';

const initialState = {
	adminQuestions: [],
	availableQuestions: [],
	favoriteQuestions: [],
	userAnsweredQuestions: [],
	totalPoints: 0
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_QUESTIONS:
			return {
				...state,
				availableQuestions: action.questions,
				adminQuestions: action.adminQuestions
			};
		case SET_FAVORITES:
			return {
				...state,
				favoriteQuestions: action.FavQuestions
			};
		case TOGGLE_FAVORITE:
			const existingIndex = state.favoriteQuestions.findIndex((question) => question.id === action.questionId);
			if (existingIndex >= 0) {
				// Remove a favorite question.
				const updatedFavQuestions = [ ...state.favoriteQuestions ];
				// console.log('updatedFavQuestions', updatedFavQuestions)
				updatedFavQuestions.splice(existingIndex, 1);
				return { ...state, favoriteQuestions: updatedFavQuestions };
			} else {
				// Add a favorite question.
				const question = state.availableQuestions.find((question) => question.id === action.questionId);
				// console.log(question);
				return { ...state, favoriteQuestions: state.favoriteQuestions.concat(question) };
			}
		case CHECK_ANSWER:
			return { 
				...state, 
				userAnsweredQuestions: state.userAnsweredQuestions.concat(action.question), 
				totalPoints: action.newTotalPoints
			};
			case FETCH_USER_TOTAL_POINTS:
			return { 
				...state, 
				totalPoints: action.totalPoints
			};
		case DELETE_ANSWERED_QUESTIONS:
			return {
				...state, userAnsweredQuestions: []
			};
		case DELETE_QUESTION:
			return {
				...state,
				adminQuestions: state.adminQuestions.filter((question) => question.id !== action.pid),
				availableQuestions: state.availableQuestions.filter((question) => question.id !== action.pid),
				favoriteQuestions: state.favoriteQuestions.filter((question) => question.id !== action.pid)
			};
		case CREATE_QUESTION:
			const newQuestion = new Question({
				index: action.questionData.index,
				id: action.questionData.id,
				categoryIds: action.questionData.categoryIds,
				ownerId: action.questionData.ownerId,
				title: action.questionData.title,
				// imageUrl: action.questionData.imageUrl,
				difficultyLevel: action.questionData.difficultyLevel,
				answer: action.questionData.answer,
				choice_Alpha: action.questionData.choice_Alpha,
				choice_Beta: action.questionData.choice_Beta,
				choice_Gamma: action.questionData.choice_Gamma,
				choice_Delta: action.questionData.choice_Delta,
				right_choice: action.questionData.right_choice
			});
			return {
				...state,
				availableQuestions: state.availableQuestions.concat(newQuestion),
				adminQuestions: state.adminQuestions.concat(newQuestion)
			};
		case UPDATE_QUESTION:
			const productIndex = state.adminQuestions.findIndex((quest) => quest.id === action.pid);
			const updatedProduct = new Question({
				id: action.pid,
				categoryIds: state.adminQuestions[productIndex].categoryIds,
				ownerId: action.questionData.ownerId,
				title: action.questionData.title,
				// imageUrl: action.questionData.imageUrl,
				difficultyLevel: action.questionData.difficultyLevel,
				// difficultyLevel: state.adminQuestions[productIndex].difficultyLevel,
				answer: action.questionData.answer,
				choice_Alpha: action.questionData.choice_Alpha,
				choice_Beta: action.questionData.choice_Beta,
				choice_Gamma: action.questionData.choice_Gamma,
				choice_Delta: action.questionData.choice_Delta,
				right_choice: action.questionData.right_choice
			});
			const updatedUserProducts = [ ...state.adminQuestions ];
			updatedUserProducts[productIndex] = updatedProduct;

			const availableProductIndex = state.availableQuestions.findIndex((quest) => quest.id === action.pid);
			const updatedAvailableProducts = [ ...state.availableQuestions ];
			updatedAvailableProducts[availableProductIndex] = updatedProduct;

			favoriteProductIndex = state.favoriteQuestions.findIndex((quest) => quest.id === action.pid);
			const updatedFavoriteProducts = [ ...state.favoriteQuestions ];
			updatedFavoriteProducts[favoriteProductIndex] = updatedProduct;
			return {
				...state,
				adminQuestions: updatedUserProducts,
				availableQuestions: updatedAvailableProducts,
				favoriteQuestions: updatedFavoriteProducts
			};
		default:
			return state; // is actually first reached when app starts
	}
};
