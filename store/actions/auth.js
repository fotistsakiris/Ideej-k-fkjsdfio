import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOG_OUT = 'LOG_OUT';

let timer;
const API_KEY = 'AIzaSyCEGJvfv5i9KQVYrH4igYDAmnupTPCDDC8';
export const authenticate = (token, userId, expiryTime) => {
	return (dispatch) => {
		dispatch(setLogoutTimer(expiryTime));
		dispatch({
			type: AUTHENTICATE,
			token: token,
			userId: userId
		});
	};
};

export const signup = (email, password) => {
	return async (dispatch) => {
		const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + API_KEY, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password,
				returnSecureToken: true
			})
		});

		if (!response.ok) {
			const errorResData = await response.json();
			const errorId = errorResData.error.message;
			let message = 'Σφάλμα κατά την διαδικασία εγγραφής!';
			if (errorId === 'EMAIL_EXISTS') {
				message = 'Αυτή η ηλεκτρονική διεύθυνση ήδη υπάρχει!';
			} else if (errorId === 'OPERATION_NOT_ALLOWED') {
				message = 'Η δυνατότητα σύνδεσης με ηλεκτρονική διεύθυνση έχει απενεργοποιηθεί!';
			} else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
				message = 'Έχουν μπλοκαριστεί όλες οι προσπάθειες από αυτή την συσκευή, λόγω ασυνήθηστων ενεργειών!';
			}
			throw new Error(message);
		}

		const resData = await response.json(); // transforms the data from json to javascript object
		dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000));
		// The first new Date converts the second's huge number of miliseconds in a concrete date.
		const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
		saveDataToStorage(resData.idToken, resData.localId, expirationDate, resData.email);
	};
};

export const login = (email, password) => {
	return async (dispatch) => {
		try {
			const response = await fetch(
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: email,
						password: password,
						returnSecureToken: true
					})
				}
			);

			if (!response.ok) {
				const errorResData = await response.json();
				const errorId = errorResData.error.message;
				let message = 'Σφάλμα κατά την διαδικασία σύνδεσης!';
				if (errorId === 'EMAIL_NOT_FOUND') {
					message = 'Η ηλεκτρονική διεύθυνση δεν βρέθηκε!';
				} else if (errorId === 'INVALID_PASSWORD') {
					message = 'Αυτός ο κωδικός είναι άκυρος!';
				} else if (errorId === 'USER_DISABLED') {
					message = 'Ο λογαριασμός σας έχει απενεργοποιηθεί!';
				}
				throw new Error(message);
			}
			const resData = await response.json(); // transforms the data from json to javascript object

			dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000));
			// The first new Date converts the second's huge number of miliseconds in a concrete date.
			const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
			saveDataToStorage(resData.idToken, resData.localId, expirationDate, resData.email);
		} catch (error) {
			throw error;
		}
	};
};

export const logout = () => {
	return async (dispatch) => {
		await AsyncStorage.removeItem('userData');
		clearLogoutTimer();
		dispatch({ type: LOG_OUT });
	};
};

const clearLogoutTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
};

// This is for automatic logging out the user...
// Gets dispatched in `authenticate` action
const setLogoutTimer = (expirationTime) => {
	return (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout());
		}, expirationTime);
	};
};

const saveDataToStorage = (token, userId, expirationDate, email) => {
	_storeData = async () => {
		try {
			// data must be in string format!
			await AsyncStorage.setItem(
				'userData',
				// stringify converts an object to a string
				JSON.stringify({
					token: token,
					userId: userId,
					expiryDate: expirationDate.toISOString(), // convert it to a string in a standardize format
					userEmail: email // for showing on every screen
				})
			);
		} catch (error) {
			// Error saving data
		}
	};
	_storeData();
};
