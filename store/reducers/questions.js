import {
	TOGGLE_FAVORITE,
	DELETE_QUESTION,
	CREATE_QUESTION,
	UPDATE_QUESTION,
	SET_QUESTIONS,
	CHECK_ANSWER,
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
		case CHECK_ANSWER:
			const appliedFilters = action.filters;
			// Check all meals if there are any matches with the filters...
			const filteredMeals = state.availableQuestions.filter((quest) => {
				// If quest should be glutenFree but it is not, return false.
				if (appliedFilters.alfa && !quest.alfaIsTrue) {
					return false;
				}
				if (appliedFilters.beta && !quest.betaIsTrue) {
					return false;
				}
				if (appliedFilters.gamma && !quest.gammaIsTrue) {
					return false;
				}
				if (appliedFilters.delta && !quest.deltaIsTrue) {
					return false;
				}
				// If we pass all the checks, then we have a quest...
				return true;
			});
			// Return a new state.
			console.log(appliedFilters);

			return { ...state, answeredQuestions: filteredMeals };
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
				userQuestions: state.userQuestions.concat(newQuestion)
			};
		case UPDATE_QUESTION:
			const productIndex = state.userQuestions.findIndex((quest) => quest.id === action.pid);
			const updatedProduct = new Question({
				id: action.pid,
				categoryIds: state.userQuestions[productIndex].categoryIds,
				ownerId: action.questionData.ownerId,
				title: action.questionData.title,
				// imageUrl: action.questionData.imageUrl,
				difficultyLevel: action.questionData.difficultyLevel,
				// difficultyLevel: state.userQuestions[productIndex].difficultyLevel,
				answer: action.questionData.answer,
				choice_Alpha: action.questionData.choice_Alpha,
				choice_Beta: action.questionData.choice_Beta,
				choice_Gamma: action.questionData.choice_Gamma,
				choice_Delta: action.questionData.choice_Delta,
				right_choice: action.questionData.right_choice
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
