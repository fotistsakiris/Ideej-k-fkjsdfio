import PRODUCTS from '../../data/products';
import {
	TOGGLE_FAVORITE,
	DELETE_PRODUCT,
	CREATE_PRODUCT,
	UPDATE_PRODUCT,
	SET_PRODUCTS,
	SET_FAVORITES
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
	userProducts: [], // PRODUCTS.filter((prod) => prod.ownerId === 'u1'), // dummy set up
	availableProducts: [], // PRODUCTS,
	favoriteProducts: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_PRODUCTS:
			return {
				...state,
				availableProducts: action.products,
				userProducts: action.userProducts
			};
		case SET_FAVORITES:
			return {
				...state,
				favoriteProducts: action.FavProducts
			};
		case TOGGLE_FAVORITE:
			const existingIndex = state.favoriteProducts.findIndex((product) => product.id === action.productId);
			if (existingIndex >= 0) {
				// Remove a favorite product.
				const updatedFavProducts = [ ...state.favoriteProducts ];
				// console.log('updatedFavProducts', updatedFavProducts)
				updatedFavProducts.splice(existingIndex, 1);
				return { ...state, favoriteProducts: updatedFavProducts };
			} else {
				// Add a favorite product.
				const product = state.availableProducts.find((product) => product.id === action.productId);
				// console.log(product);
				return { ...state, favoriteProducts: state.favoriteProducts.concat(product) };
			}
		case DELETE_PRODUCT:
			return {
				...state,
				userProducts: state.userProducts.filter((product) => product.id !== action.pid),
				availableProducts: state.availableProducts.filter((product) => product.id !== action.pid),
				favoriteProducts: state.favoriteProducts.filter((product) => product.id !== action.pid)
			};
		case CREATE_PRODUCT:
			const newProduct = new Product({
				index: action.productData.index,
				id: action.productData.id,
				categoryIds: action.productData.categoryIds,
				ownerId: action.productData.ownerId,
				title: action.productData.title,
				imageUrl: action.productData.imageUrl,
				price: action.productData.price,
				description: action.productData.description
			});
			return {
				...state,
				availableProducts: state.availableProducts.concat(newProduct),
				userProducts: state.userProducts.concat(newProduct)
			};
		case UPDATE_PRODUCT:
			const productIndex = state.userProducts.findIndex((prod) => prod.id === action.pid);
			const updatedProduct = new Product({
				id: action.pid,
				categoryIds: state.userProducts[productIndex].categoryIds,
				ownerId: action.productData.ownerId,
				title: action.productData.title,
				imageUrl: action.productData.imageUrl,
				price: state.userProducts[productIndex].price,
				description: action.productData.description
			});
			const updatedUserProducts = [ ...state.userProducts ];
			updatedUserProducts[productIndex] = updatedProduct;

			const availableProductIndex = state.availableProducts.findIndex((prod) => prod.id === action.pid);
			const updatedAvailableProducts = [ ...state.availableProducts ];
			updatedAvailableProducts[availableProductIndex] = updatedProduct;

			favoriteProductIndex = state.favoriteProducts.findIndex((prod) => prod.id === action.pid);
			const updatedFavoriteProducts = [ ...state.favoriteProducts ];
			updatedFavoriteProducts[favoriteProductIndex] = updatedProduct;
			return {
				...state,
				userProducts: updatedUserProducts,
				availableProducts: updatedAvailableProducts,
				favoriteProducts: updatedFavoriteProducts
			};
		default:
			return state; // is actually first reached when app starts
	}
};
