import PRODUCTS from '../../data/products';
import { TOGGLE_FAVORITE, DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT } from '../actions/products';
import Icon from '../../models/icon';

const initialState = {
	userProducts: PRODUCTS.filter((prod) => prod.ownerId === 'u1'), // dummy set up
	availableProducts: PRODUCTS,
	favoriteProducts: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_FAVORITE:
			const existingIndex = state.favoriteProducts.findIndex((product) => product.id === action.productId);
			if (existingIndex >= 0) {
				// Remove a favorite product.
				const updatedFavProducts = [ ...state.favoriteProducts ];
				updatedFavProducts.splice(existingIndex, 1);
				return { ...state, favoriteProducts: updatedFavProducts };
			} else {
				// Add a favorite product.
				const product = state.availableProducts.find((product) => product.id === action.productId);
				return { ...state, favoriteProducts: state.favoriteProducts.concat(product) };
			}
		case DELETE_PRODUCT:
			return {
				...state,
				userProducts: state.userProducts.filter((product) => product.id !== action.pid),
				availableProducts: state.availableProducts.filter((product) => product.id !== action.pid)
			};
		case CREATE_PRODUCT:
			const newProduct = new Icon(
				new Date().toString,
				'u1',
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				action.productData.price
			);
			return {
				...state,
				availableProducts: state.availableProducts.concat(newProduct),
				userProducts: state.userProducts.concat(newProduct)
			};
		case UPDATE_PRODUCT:
			const productIndex = state.userProducts.findIndex((prod) => prod.id === action.pid);
			const updatedProduct = new Icon(
				action.pid,
				state.userProducts[productIndex].ownerId,
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				state.userProducts[productIndex].price
			);
			const updatedUserProducts = [ ...state.userProducts ];
			updatedUserProducts[productIndex] = updatedProduct;

			const availableProductIndex = state.availableProducts.findIndex((prod) => prod.id === action.pid);
			const updatedAvailableProducts = [ ...state.availableProducts ];
			updatedAvailableProducts[availableProductIndex] = updatedProduct;
			return {
				...state,
				userProducts: updatedUserProducts,
				availableProducts: updatedAvailableProducts
			};
		default:
			return state; // is actually first reached when app starts
	}
};
