import { ADD_CHOICE, SET_CHOICES } from '../actions/choices';
import Choice from '../../models/choice';

const initialState = {
	choices: []
};
export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_CHOICE:
			const newChoice = new Choice({
				id: action.choiceData.id,
				items: action.choiceData.items,
				totalAmount: action.choiceData.totalAmount,
				date: action.choiceData.date
			});
			return {
				// ...state,
				choices: state.choices.concat(newChoice)
			};
		case SET_CHOICES:
			return {
				choices: action.choices
			};
		default:
			return state;
	}
};
