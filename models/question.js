// class Question {
//     constructor(id, categoryIds, ownerId, title, imageUrl, answer, difficultyLevel) {
//         this.id = id;
//         this.categoryIds = categoryIds;
//         this.ownerId = ownerId;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.answer = answer;
//         this.difficultyLevel = difficultyLevel;
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
	this.difficultyLevel = info.difficultyLevel;
	this.answer = info.answer;
	this.choice_Alpha = info.choice_Alpha;
	this.choice_Beta = info.choice_Beta;
	this.choice_Gamma = info.choice_Gamma;
	this.choice_Delta = info.choice_Delta;
	this.right_choice = info.right_choice;
}

export default Question;
