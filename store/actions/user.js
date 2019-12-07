export const FETCH_USER_TOTAL_POINTS = 'FETCH_USER_TOTAL_POINTS'

export const fetchTotalPoints = () => {
	return async (dispatch, getState) => {
		try {
			const userId = getState().auth.userId;
			const response = await fetch(`https://en-touto-nika.firebaseio.com//user_totalPoints/${userId}.json`);

			// check before unpack the response body
			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η φόρτωση των αγαπημένων προϊόντων δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			const resData = await response.json();

			

			dispatch({ type: FETCH_USER_TOTAL_POINTS, FavQuestions: loadedFavorites });
		} catch (err) {
			// send to custom analytics server
			console.log(err);

			throw err;
		}
	};
};