// class Question {
//     constructor(id, categoryIds, ownerId, title, imageUrl, description, points) {
//         this.id = id;
//         this.categoryIds = categoryIds;
//         this.ownerId = ownerId;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.points = points;
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
	this.points = info.points;
	this.description = info.description;
}

export default Question;
