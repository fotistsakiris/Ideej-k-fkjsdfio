// class CartItemModel {
// 	constructor(quantity, productPrice, questionTitle, sum) {
// 		this.quantity = quantity;
// 		this.productPrice = productPrice;
// 		this.questionTitle = questionTitle;
// 		this.sum = sum;
// 	}
// }

function CartItemModel (info) {
	this.index = info.index; // for keeping the choice in cartScreen
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
