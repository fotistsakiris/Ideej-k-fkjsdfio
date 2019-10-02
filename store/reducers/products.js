import PRODUCTS from '../../data/products';
import { TOGGLE_FAVORITE, SET_FILTERS } from '../actions/products';

const initialState = {
    availableProducts: PRODUCTS,
    favoriteProducts: [],
    userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1')
}

export default (state = initialState, action) => {
    switch (action.type) {
		case TOGGLE_FAVORITE:
			const existingIndex = state.favoriteProducts.findIndex((product) => product.id === action.productId);
			if (existingIndex >= 0) {
                // Remove a favorite product.
				const updatedFavProducts= [ ...state.favoriteProducts];
				updatedFavMeals.splice(existingIndex, 1);
				return { ...state, favoriteMeals: updatedFavProducts};
			} else {
				// Add a favorite product.
				const product = state.availableProducts.find((product) => product.id === action.productId);
				return { ...state, favoriteProducts: state.favoriteProducts.concat(product) };
			}
		case SET_FILTERS:
			const appliedFilters = action.filters;
			// Check all meals if there are any matches with the filters...
			const filteredMeals = state.meals.filter((meal) => {
				// If meal should be glutenFree but it is not, return false.
				if (appliedFilters.glutenFree && !meal.isGlutenFree) {
					return false;
				}
				if (appliedFilters.lactoseFree && !meal.isLactoseFree) {
					return false;
				}
				if (appliedFilters.vegan && !meal.isVegan) {
					return false;
				}
				if (appliedFilters.vegetarian && !meal.isVegetarian) {
					return false;
				}
				// If we pass all the checks, then we have a meal...
				return true;
			});
			// Return a new state.
			return {...state, filteredMeals: filteredMeals}
		default:
			return state; // is actually first reached when app starts
	}
}