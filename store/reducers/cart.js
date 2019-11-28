import { ADD_TO_CARD, REMOVE_FROM_CARD } from '../actions/cart';
import { DELETE_QUESTION } from '../actions/questions';

import { ADD_CHOICE } from '../actions/choices';

import CartItemModel from '../../models/cart-item-model';

const initialState = {
	items: {},
	totalAmount: 0
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CARD:
			const addedQuestion = action.question;
			const questIndex = addedQuestion.index;
			const questPrice = addedQuestion.points;
			const questTitle = addedQuestion.title;
			let upadtatedOrNewCartItem;
			// Check if we already have the item in the cart.
			if (state.items[addedQuestion.id]) {
				upadtatedOrNewCartItem = new CartItemModel({
					index: questIndex,
					quantity: state.items[addedQuestion.id].quantity + 1,
					points: questPrice,
					title: questTitle,
					sum: state.items[addedQuestion.id].sum + questPrice
				});
			} else {
				upadtatedOrNewCartItem = new CartItemModel({
					index: questIndex, // for keeping the choice in cartScreen
					quantity: 1,
					points: questPrice,
					title: questTitle,
					sum: questPrice
				});
			}
			return {
				...state,
				items: { ...state.items, [addedQuestion.id]: upadtatedOrNewCartItem },
				totalAmount: state.totalAmount + questPrice
			};
		case REMOVE_FROM_CARD:
			const selectedCartItem = state.items[action.pid];
			const currentQty = selectedCartItem.quantity;
			let updatedCartItems;
			if (currentQty > 1) {
				// need to reduce it not erase it
				const updatedCartItem = new CartItemModel({
					index: selectedCartItem.index, // for keeping the choice in cartScreen
					quantity: selectedCartItem.quantity - 1,
					points: selectedCartItem.points,
					title: selectedCartItem.title,
					sum: selectedCartItem.sum - selectedCartItem.points
				});
				updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
			} else {
				updatedCartItems = { ...state.items };
				delete updatedCartItems[action.pid];
			}
			return {
				...state,
				items: updatedCartItems,
				totalAmount: state.totalAmount - selectedCartItem.points
			};
		case ADD_CHOICE:
			return initialState; // Just clearing the cart!
		case DELETE_QUESTION: // Admin !!!
			// If item doesn't exist...
			if (!state.items[action.pid]) {
				return state;
			}
			const updatedItems = { ...state.items };
			// In case the item is allready in the cart...
			itemTotal = state.items[action.pid].sum;
			delete updatedItems[action.pid];
			return {
				...state,
				items: updatedItems,
				totalAmount: state.totalAmount - itemTotal
			};
		default:
			return state;
	}
};
