export const ADD_TO_CARD = 'ADD_TO_CARD';
export const REMOVE_FROM_CARD = 'REMOVE_FROM_CARD';

export const addToCard = (question) => {
	return {
		type: ADD_TO_CARD,
		question: question
	};
};

export const removeFromCart = (questionId) => {
	return {
		type: REMOVE_FROM_CARD,
		pid: questionId
	};
};
