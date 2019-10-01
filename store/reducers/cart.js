import { ADD_TO_CARD, REMOVE_FROM_CARD } from '../actions/cart';
import CartItemModel from '../../models/cart-item-model';

const initialState = {
	items: {},
	totalAmount: 0
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CARD:
			const addedProduct = action.product;
			const prodPrice = addedProduct.price;
			const prodTitle = addedProduct.title;
			let upadtatedOrNewCartItem;
			// Check if we already have the item in the cart.
			if (state.items[addedProduct.id]) {
				upadtatedOrNewCartItem = new CartItemModel(
					state.items[addedProduct.id].quantity + 1,
					prodPrice,
					prodTitle,
					state.items[addedProduct.id].sum + prodPrice
				);
			} else {
				upadtatedOrNewCartItem = new CartItemModel(1, prodPrice, prodTitle, prodPrice);
			}
			return {
				...state,
				items: { ...state.items, [addedProduct.id]: upadtatedOrNewCartItem },
				totalAmount: state.totalAmount + prodPrice
			};
			case REMOVE_FROM_CARD:
			const selectedCartItem = state.items[action.pid];
			const currentQty = selectedCartItem.quantity;
			let updatedCartItems;
			if (currentQty > 1) {
				// need to reduce it not erase it
				const updatedCartItem = new CartItemModel(
					selectedCartItem.quantity - 1,
					selectedCartItem.productPrice,
					selectedCartItem.productTitle,
					selectedCartItem.sum - selectedCartItem.productPrice
				);
				updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
			} else {
				updatedCartItems = { ...state.items };
				delete updatedCartItems[action.pid];
			}
			return {
				...state,
				items: updatedCartItems,
				totalAmount: state.totalAmount - selectedCartItem.productPrice
			};
			
			default:
			return state;
	}
	
};
