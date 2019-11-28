//  import moment from 'moment';

// class Choice {
// 	constructor(id, items, sum, date) {
// 		this.id = id;
// 		this.items = items;
// 		this.sum = sum;
// 		this.date = date;
// 	}

	function Choice (data) {
		this.id = data.id;
		this.items = data.items;
		this.totalAmount = data.totalAmount;
		this.date = data.date;
	}

	// get readableDate() {
	// 	// Problem with android
	// 	// return this.date.toLocaleDateString('en-En', {
	// 	// 	year: 'numeric',
	// 	// 	month: 'long',
	// 	// 	day: 'numeric',
	// 	// 	hour: '2-digit',
	// 	// 	minute: '2-digit'
	// 	// });
	// 	return moment(this.date).format('DD/MM/YYYY, hh:mm')
	// }
// }

export default Choice;
