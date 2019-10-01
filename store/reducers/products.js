import PRODUCTS from '../../data/products';

const initialState = {
    availableProducts: PRODUCTS,
    favoriteProducts: [],
    userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1')
}

export default (state = initialState, action) => {
    return state
}