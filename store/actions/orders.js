export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

import Order from '../../models/order'

export const addOrder = (cartItems, totalAmount) => {
	return async (dispatch) => {
		try {
			const date = new Date();
			const response = await fetch('https://ekthesi-7767c.firebaseio.com/orders.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					cartItems,
					totalAmount,
					date: date.toISOString()
				})
			});
			// check before unpack the response body
			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η προσθήκη της παραγγελίας δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.'
				);
			}
			const resData = await response.json();
			
			dispatch({
				type: ADD_ORDER,
				orderData: {
					id: resData.name,
					items: cartItems,
					totalAmount: totalAmount,
					date: date
				}
			});
		} catch (err) {
			throw err;
		}
	};
};


export const fetchOrders = () => {
	return async (dispatch) => {
		try {
			const response = await fetch('https://ekthesi-7767c.firebaseio.com/orders.json');

			// check before unpack the response body
			if (!response.ok) {
				throw new Error('Δυστυχώς η φόρτωση των παραγγελιών δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.');
			}

			const resData = await response.json();
			const loadedOrders = [];
			console.log(resData);
			

			for (const key in resData) {
				loadedOrders.push(
					new Order({
					id: key,
					items: resData[key].cartItems,
					totalAmount: resData[key].totalAmount,
					date: resData[key].date 
					})
				);
			}

			dispatch({ type: SET_ORDERS, orders: loadedOrders });
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};