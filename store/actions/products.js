export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
export const SET_FILTERS = 'SET_FILTERS';
export const SET_PRODUCTS = 'SET_PRODUCTS';

import Icon from '../../models/icon';

// Admin
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const toggleFavorite = (id, isFav) => {
	return async (dispatch) => {
		try {
			if (isFav) {
				const response = await fetch('https://ekthesi-7767c.firebaseio.com/favorites.json', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id,
						isFav
					})
				});

				if (!response.ok) {
					throw new Error(
						'Δυστυχώς η δημιουργία νέου προϊόντος δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.'
					);
				}

				dispatch({ type: TOGGLE_FAVORITE, productId: id });
			} else if (!isFav) {
				// console.log(isFav);
				
				const response = await fetch(`https://ekthesi-7767c.firebaseio.com/favorites/.json`);

				if (!response.ok) {
					throw new Error(
						'Δυστυχώς η διαγραφή του προϊόντος δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.'
					);
				}

				const resData = await response.json();
				console.log(resData.name);

				for (const key in resData) {
					// console.log(key);
					await fetch(`https://ekthesi-7767c.firebaseio.com/favorites/${key}.json`, {
						method: 'DELETE'
					});

					if (!response.ok) {
						throw new Error(
							'Δυστυχώς η διαγραφή του προϊόντος δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.'
						);
					}

					dispatch({ type: TOGGLE_FAVORITE, productId: id });
				}
			}
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
	// return { type: TOGGLE_FAVORITE, productId: id };
};

export const setFilters = (filterSettings) => {
	return { type: SET_FILTERS, filters: filterSettings };
};

// Admin
export const deleteProduct = (productId) => {
	return async (dispatch) => {
		const response = await fetch(`https://ekthesi-7767c.firebaseio.com/products/${productId}.json`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error('Δυστυχώς η διαγραφή του προϊόντος δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.');
		}

		dispatch({
			type: DELETE_PRODUCT,
			pid: productId
		});
	};
};

export const fetchProducts = () => {
	return async (dispatch) => {
		try {
			const response = await fetch('https://ekthesi-7767c.firebaseio.com/products.json');

			// check before unpack the response body
			if (!response.ok) {
				throw new Error('Δυστυχώς η φόρτωση των προϊόντων δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.');
			}

			const resData = await response.json();
			const loadedProducts = [];

			for (const key in resData) {
				loadedProducts.push(
					new Icon({
						id: key,
						categoryIds: resData[key].categoryIds,
						ownerId: resData[key].ownerId,
						title: resData[key].title,
						imageUrl: resData[key].imageUrl,
						price: resData[key].price,
						description: resData[key].description
					})
				);
			}

			dispatch({ type: SET_PRODUCTS, products: loadedProducts });
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};

export const createProduct = (title, categoryIds, ownerId, imageUrl, price, description) => {
	return async (dispatch) => {
		try {
			const response = await fetch('https://ekthesi-7767c.firebaseio.com/products.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					categoryIds,
					ownerId,
					title,
					imageUrl,
					price,
					description
				})
			});

			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η δημιουργία νέου προϊόντος δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.'
				);
			}

			const resData = await response.json();
			console.log(resData);
			dispatch({
				type: CREATE_PRODUCT,
				productData: {
					id: resData.name,
					categoryIds,
					ownerId,
					title,
					description,
					imageUrl,
					price
				}
			});
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};

export const updateProduct = (id, title, categoryIds, ownerId, imageUrl, description) => {
	return async (dispatch) => {
		try {
			const response = await fetch(`https://ekthesi-7767c.firebaseio.com/products/${id}.json`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title,
					categoryIds,
					ownerId,
					imageUrl,
					description
				})
			});

			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η ανανέωση των πληροφωριών του προϊόντος δεν ήταν δυνατή! Παρακαλώ ελέγξτε τη σύνδεσή σας.'
				);
			}

			dispatch({
				type: UPDATE_PRODUCT,
				pid: id,
				productData: {
					title,
					categoryIds,
					ownerId,
					imageUrl,
					description
				}
			});
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};
