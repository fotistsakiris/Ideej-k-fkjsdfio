import { ADD_ORDER, SET_ORDERS } from '../actions/orders';
import Order from '../../models/order';

const initialState = {
	orders: []
};
export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_ORDER:
			const newOrder = new Order({
				id: action.orderData.id,
				items: action.orderData.items,
				totalAmount: action.orderData.totalAmount,
				date: action.orderData.date
			});
			return {
				// ...state,
				orders: state.orders.concat(newOrder)
			};
		case SET_ORDERS:
			return {
				orders: action.orders
			};
		default:
			return state;
	}
};
