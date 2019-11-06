// class CartItemModel {
// 	constructor(quantity, productPrice, productTitle, sum) {
// 		this.quantity = quantity;
// 		this.productPrice = productPrice;
// 		this.productTitle = productTitle;
// 		this.sum = sum;
// 	}
// }

function CartItemModel (info) {
	this.index = info.index;
	this.quantity = info.quantity;
	this.sum = info.sum;
	this.id = info.id;
	this.categoryIds = info.categoryIds;
	this.ownerId = info.ownerId;
	this.title = info.title;
	this.imageUrl = info.imageUrl;
	this.price = info.price;
	this.description = info.description;
}


export default CartItemModel;
