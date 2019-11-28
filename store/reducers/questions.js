import {
	TOGGLE_FAVORITE,
	DELETE_QUESTION,
	CREATE_QUESTION,
	UPDATE_QUESTION,
	SET_QUESTIONS,
	SET_FAVORITES
} from '../actions/questions';
import Question from '../../models/question';

const initialState = {
	userQuestions: [], 
	availableQuestions: [], 
	favoriteQuestions: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_QUESTIONS:
			return {
				...state,
				availableQuestions: action.questions,
				userQuestions: action.userQuestions
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
		case DELETE_QUESTION:
			return {
				...state,
				userQuestions: state.userQuestions.filter((question) => question.id !== action.pid),
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
				imageUrl: action.questionData.imageUrl,
				price: action.questionData.price,
				description: action.questionData.description
			});
			return {
				...state,
				availableQuestions: state.availableQuestions.concat(newQuestion),
				userQuestions: state.userQuestions.concat(newQuestion)
			};
		case UPDATE_QUESTION:
			const productIndex = state.userQuestions.findIndex((quest) => quest.id === action.pid);
			const updatedProduct = new Question({
				id: action.pid,
				categoryIds: state.userQuestions[productIndex].categoryIds,
				ownerId: action.questionData.ownerId,
				title: action.questionData.title,
				imageUrl: action.questionData.imageUrl,
				price: action.questionData.price, 
				// price: state.userQuestions[productIndex].price,
				description: action.questionData.description
			});
			const updatedUserProducts = [ ...state.userQuestions ];
			updatedUserProducts[productIndex] = updatedProduct;

			const availableProductIndex = state.availableQuestions.findIndex((quest) => quest.id === action.pid);
			const updatedAvailableProducts = [ ...state.availableQuestions ];
			updatedAvailableProducts[availableProductIndex] = updatedProduct;

			favoriteProductIndex = state.favoriteQuestions.findIndex((quest) => quest.id === action.pid);
			const updatedFavoriteProducts = [ ...state.favoriteQuestions ];
			updatedFavoriteProducts[favoriteProductIndex] = updatedProduct;
			return {
				...state,
				userQuestions: updatedUserProducts,
				availableQuestions: updatedAvailableProducts,
				favoriteQuestions: updatedFavoriteProducts
			};
		default:
			return state; // is actually first reached when app starts
	}
};
