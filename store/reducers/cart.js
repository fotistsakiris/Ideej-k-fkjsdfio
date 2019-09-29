import { ADD_TO_CARD } from '../actions/cart';
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
					state.items[addedProduct.id] + prodPrice
				);
			} else {
				upadtatedOrNewCartItem = new CartItemModel(1, prodPrice, prodTitle, prodPrice);
			}
			return {
				...state,
				items: { ...state.items, [addedProduct.id]: upadtatedOrNewCartItem },
				totalAmount: state.totalAmount + prodPrice
			};
			default:
			return state;
	}
	
};
