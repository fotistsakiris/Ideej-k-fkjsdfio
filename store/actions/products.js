export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
export const SET_FILTERS = 'SET_FILTERS';

// Admin
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const toggleFavorite = (id) => {
    return { type: TOGGLE_FAVORITE, productId: id}
}

export const setFilters = (filterSettings) => {
    return { type: SET_FILTERS, filters: filterSettings}
}

// Admin
export const deleteProduct = (productId) => {
	return {
		type: DELETE_PRODUCT,
		pid: productId
	};
};

export const createProduct = (title, description, imageUrl, price) => {
	return {
		type: CREATE_PRODUCT,
		productData: {
			title,
			description,
			imageUrl,
			price
		}
	};
};

export const updateProduct = (id, title, description, imageUrl) => {
	return {
		type: UPDATE_PRODUCT,
		pid: id,
		productData: {
			title,
			description,
			imageUrl,
		}
	};
};