// class Question {
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

// export default Question;

function Question(info) {
	this.index = info.index; // for keeping the choice in cartScreen
	this.id = info.id;
	this.categoryIds = info.categoryIds;
	this.ownerId = info.ownerId;
	this.title = info.title;
	this.imageUrl = info.imageUrl;
	this.price = info.price;
	this.description = info.description;
}

export default Question;
