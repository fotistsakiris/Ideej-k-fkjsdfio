// DO NOT FORGET TO EXPORT THE CONSTANTS
export const ADD_ORDER = 'ADD_ORDER';

// REMEMBER actions reach all reducers. So you can handle this action also in the cart reducer.
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
					amount: totalAmount,
					date: date
				}
			});
		} catch (err) {
			throw err;
		}
	};
};
