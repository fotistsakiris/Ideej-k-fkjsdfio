// class Product {
//     constructor(id, categoryIds, ownerId, title, imageUrl, description, price) {
//         this.id = id;
//         this.categoryIds = categoryIds;
//         this.ownerId = ownerId;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

// }

// export default Product;

function Product(info) {
	this.index = info.index; // for keeping the order in cartScreen
	this.id = info.id;
	this.categoryIds = info.categoryIds;
	this.ownerId = info.ownerId;
	this.title = info.title;
	this.imageUrl = info.imageUrl;
	this.price = info.price;
	this.description = info.description;
}

export default Product;
