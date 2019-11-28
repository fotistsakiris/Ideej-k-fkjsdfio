export const ADD_CHOICE = 'ADD_CHOICE';
export const SET_CHOICES = 'SET_CHOICES';

import Choice from '../../models/choice'

export const addOrder = (cartItems, totalAmount) => {
	return async (dispatch, getState) => {
		try {
			const token = getState().auth.token;
			const userId = getState().auth.userId;
			const date = new Date();
			// testing
			// const response = await fetch(`https://ekthesi-7767c.firebaseio.com/choices/eeR9esY0l8OxcxJPPA1Gp4T5Xsy1.json`, {
			const response = await fetch(`https://ekthesi-7767c.firebaseio.com/choices/${userId}.json?auth=${token}`, {
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
					'Δυστυχώς η προσθήκη της παραγγελίας δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}
			const resData = await response.json();
			
			dispatch({
				type: ADD_CHOICE,
				choiceData: {
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
	return async (dispatch, getState) => {
		try {
			const userId = getState().auth.userId;
			//testing
			// const response = await fetch(`https://ekthesi-7767c.firebaseio.com/choices/eeR9esY0l8OxcxJPPA1Gp4T5Xsy1.json`);
			const response = await fetch(`https://ekthesi-7767c.firebaseio.com/choices/${userId}.json`);


			// check before unpack the response body
			if (!response.ok) {
				throw new Error('Δυστυχώς η φόρτωση των παραγγελιών δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.');
			}

			const resData = await response.json();
			const loadedOrders = [];

			for (const key in resData) {
				loadedOrders.push(
					new Choice({
					id: key,
					items: resData[key].cartItems,
					totalAmount: resData[key].totalAmount,
					date: resData[key].date
					})
				);
			}

			dispatch({ type: SET_CHOICES, choices: loadedOrders });
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};