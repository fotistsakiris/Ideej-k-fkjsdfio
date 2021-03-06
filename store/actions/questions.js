export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
export const CHECK_ANSWER = 'CHECK_ANSWER';
export const DELETE_ANSWERED_QUESTIONS = 'DELETE_ANSWERED_QUESTIONS';
export const SET_QUESTIONS = 'SET_QUESTIONS';
export const SET_FAVORITES = 'SET_FAVORITES';
export const FETCH_USER_TOTAL_POINTS = 'FETCH_USER_TOTAL_POINTS';
export const DELETE_TOTAL_POINTS = 'DELETE_TOTAL_POINTS';
export const DELETE_PREVIOUS_USER_DATA = 'DELETE_PREVIOUS_USER_DATA';
export const SAVE_DATA_TO_ALL_USERS_DATA = 'SAVE_DATA_TO_ALL_USERS_DATA';
export const FETCH_All_USERS_DATA = 'FETCH_All_USERS_DATA';

import Question from '../../models/question';

// Admin
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const CREATE_QUESTION = 'CREATE_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';

export const toggleFavorite = (id, isFav, selectedQuestion) => {
	return async (dispatch, getState) => {
		try {
			const token = getState().auth.token;
			const userId = getState().auth.userId;
			// If it is a favorite, post it.
			// Note it is initially false...
			if (!isFav) {
				const response = await fetch(
					`https://en-touto-nika.firebaseio.com//favorites/${userId}.json?auth=${token}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							id,
							isFav,
							selectedQuestion
						})
					}
				);

				if (!response.ok) {
					throw new Error(
						'Δυστυχώς η δημιουργία νέου προϊόντος δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
					);
				}
				// const resData = await response.json();

				// Note: No `name` property, that's why we use a `for_in` loop
				// console.log('POST', JSON.stringify(resData));

				dispatch({ type: TOGGLE_FAVORITE, questionId: id, selectedQuestion: selectedQuestion });
			} else if (isFav) {
				// First get the key in choice to delete it in second fetch(...).
				const response = await fetch(
					`https://en-touto-nika.firebaseio.com//favorites/${userId}.json?auth=${token}`
				);

				if (!response.ok) {
					throw new Error(
						'Δυστυχώς η διαγραφή του προϊόντος από τα αγαπημένα, δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
					);
				}

				const resData = await response.json();

				// Note: No `name` property, that's why we use a `for_in` loop
				// console.log('fetch', JSON.stringify(resData));

				for (const key in resData) {
					if (resData[key].id === id) {
						// console.log('resData[key].id', resData[key].id);
						// console.log('id', id);
						await fetch(
							`https://en-touto-nika.firebaseio.com//favorites/${userId}/${key}.json?auth=${token}`,
							{
								method: 'DELETE'
							}
						);

						if (!response.ok) {
							throw new Error(
								'Δυστυχώς η διαγραφή του προϊόντος από τα αγαπημένα, δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
							);
						}
						// console.log('fetch', JSON.stringify(resData));
						dispatch({ type: TOGGLE_FAVORITE, questionId: id, selectedQuestion: selectedQuestion });
					}
				}
			}
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};

export const fetchFavQuestions = () => {
	return async (dispatch, getState) => {
		try {
			const userId = getState().auth.userId;
			const FavResponse = await fetch(`https://en-touto-nika.firebaseio.com//favorites/${userId}.json`);

			// check before unpack the response body
			if (!FavResponse.ok) {
				throw new Error(
					'Δυστυχώς η φόρτωση των αγαπημένων προϊόντων δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			const resFavData = await FavResponse.json();

			const loadedFavorites = [];
			// If resFavData is not null then create a question...
			// Other wise we get an error in FavoritesScreen!
			if (!!resFavData) {
				let selectedQuestion = null;
				for (const key in resFavData) {
					selectedQuestion = resFavData[key].selectedQuestion;
				}

				loadedFavorites.push(
					new Question({
						id: selectedQuestion.id,
						categoryIds: selectedQuestion.categoryIds,
						ownerId: selectedQuestion.ownerId,
						index: selectedQuestion.index,
						title: selectedQuestion.title,
						// imageUrl: selectedQuestion.imageUrl,
						difficultyLevel: selectedQuestion.difficultyLevel,
						answer: selectedQuestion.answer
					})
				);
			}

			dispatch({ type: SET_FAVORITES, FavQuestions: loadedFavorites });
		} catch (err) {
			// send to custom analytics server
			console.log(err);

			throw err;
		}
	};
};

export const checkAnswer = (question, AnswerIsCorrect, difficultyLevel, totalPoints) => {
	return async (dispatch, getState) => {
		try {
			let newTotalPoints = totalPoints;

			if (AnswerIsCorrect) {
				newTotalPoints += difficultyLevel;
			}

			const token = getState().auth.token;
			const userId = getState().auth.userId;

			const user_answered_questionsResponse = await fetch(
				`https://en-touto-nika.firebaseio.com//user_answered_questions/${userId}.json?auth=${token}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						question,
						AnswerIsCorrect,
						newTotalPoints
					})
				}
			);

			if (!user_answered_questionsResponse.ok) {
				throw new Error(
					'Δυστυχώς η αποθήκευση τηε ερώτησης ως απαντημένης δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			if (newTotalPoints > 0) {
				const totalPointsresponse = await fetch(
					`https://en-touto-nika.firebaseio.com//user_totalPoints/${userId}.json?auth=${token}`,
					{
						method: 'DELETE'
					}
				);

				if (!totalPointsresponse.ok) {
					throw new Error(
						'Δυστυχώς η διαγραφή της τελευταίας βαθμολογίας δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
					);
				}
			}
			const totalPointsresponse = await fetch(
				`https://en-touto-nika.firebaseio.com//user_totalPoints/${userId}.json?auth=${token}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						newTotalPoints
					})
				}
			);
			if (!totalPointsresponse.ok) {
				throw new Error(
					'Δυστυχώς η αποθήκευση της τελευταίας βαθμολογίας δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			dispatch({
				type: CHECK_ANSWER,
				question: question,
				AnswerIsCorrect: AnswerIsCorrect,
				newTotalPoints: newTotalPoints
			});
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};

export const saveDataToAllUsersData = (totalPoints, email) => {
	return async (dispatch, getState) => {
		try {
			const token = getState().auth.token;
			const userId = getState().auth.userId;
			const date = new Date();

			// Fist post the data
			const firstPostResponse = await fetch(
				`https://en-touto-nika.firebaseio.com//All_Users_Data/${userId}.json?auth=${token}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						totalPoints,
						email,
						date: date.toISOString()
					})
				}
			);
			
			dispatch({
				type: SAVE_DATA_TO_ALL_USERS_DATA,
				allusersData: {
					totalPoints,
					email,
					date
				}
			});
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};

export const fetchTotalPoints = () => {
	return async (dispatch, getState) => {
		try {
			const userId = getState().auth.userId;
			const response = await fetch(`https://en-touto-nika.firebaseio.com//user_totalPoints/${userId}.json`);

			// check before unpack the response body
			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η φόρτωση του ιστορικού της βοθμολογίας σας δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			const resData = await response.json();
			let totalPoints = 0;
			for (const key in resData) {
				totalPoints = resData[key].newTotalPoints;
			}
			// console.log('totalPoints', totalPoints);

			dispatch({ type: FETCH_USER_TOTAL_POINTS, totalPoints: totalPoints });
		} catch (err) {
			// send to custom analytics server
			console.log(err);

			throw err;
		}
	};
};

export const fetchAllUsersData = () => {
	return async (dispatch, getState) => {
		try {
			const response = await fetch(`https://en-touto-nika.firebaseio.com//All_Users_Data.json`);

			// check before unpack the response body
			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η φόρτωση των δεδομένων για όλους τους παίκτες δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			const resData = await response.json();

			dispatch({
				type: FETCH_All_USERS_DATA,
				allUsersData: resData
			});
		} catch (err) {
			// send to custom analytics server
			console.log(err);

			throw err;
		}
	};
};

export const deletePreviousUserData = () => {
	return async (dispatch, getState) => {
		try {
			const token = getState().auth.token;
			const userId = getState().auth.userId;

			// Delete active user's data from All_Users_Data
			const deleteTotalPointsResponseInAllUsersData = await fetch(
				`https://en-touto-nika.firebaseio.com//All_Users_Data/${userId}.json?auth=${token}`,
				{
					method: 'DELETE'
				}
			);
			if (!deleteTotalPointsResponseInAllUsersData.ok) {
				throw new Error(
					'Δυστυχώς η διαγραφή της βαθμολογίας δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}
			// This action does not need to be handled from reducer.
			dispatch({ type: DELETE_PREVIOUS_USER_DATA });
		} catch (err) {
			// send to custom analytics server
			console.log(err);

			throw err;
		}
	};
};

export const deleteTotalPoints = () => {
	return async (dispatch, getState) => {
		try {
			const token = getState().auth.token;
			const userId = getState().auth.userId;

			// For only totalPoints on user_totalPoints address
			const totalPointsresponse = await fetch(
				`https://en-touto-nika.firebaseio.com//user_totalPoints/${userId}.json?auth=${token}`,
				{
					method: 'DELETE'
				}
			);

			if (!totalPointsresponse.ok) {
				throw new Error(
					'Δυστυχώς η διαγραφή της βαθμολογίας δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			dispatch({ type: DELETE_TOTAL_POINTS });
		} catch (err) {
			// send to custom analytics server
			console.log(err);

			throw err;
		}
	};
};

export const deleteAnsweredQuestions = () => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		const response = await fetch(
			`https://en-touto-nika.firebaseio.com//user_answered_questions/${userId}.json?auth=${token}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			throw new Error('Δυστυχώς η διαγραφή των ερωτήσεων δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.');
		}

		dispatch({ type: DELETE_ANSWERED_QUESTIONS });
	};
};

// Admin
export const deleteQuestion = (questionId) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		//testing
		// const response = await fetch(`https://en-touto-nika.firebaseio.com//questions/${questionId}.json`, {
		const response = await fetch(
			`https://en-touto-nika.firebaseio.com//questions/${questionId}.json?auth=${token}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			throw new Error('Δυστυχώς η διαγραφή της ερωτήσεως δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.');
		}

		dispatch({
			type: DELETE_QUESTION,
			pid: questionId
		});
	};
};

export const fetchQuestions = () => {
	return async (dispatch, getState) => {
		try {
			const userId = getState().auth.userId;
			const response = await fetch('https://en-touto-nika.firebaseio.com//questions.json');

			// Get user's answered questions in order to remove them from the available questions.
			const user_answered_questions_response = await fetch(
				`https://en-touto-nika.firebaseio.com//user_answered_questions/${userId}.json`
			);

			// Check before unpack the response body
			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η φόρτωση των ερωτήσεων δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			let resData = await response.json();
			let availablequestions = [];
			availablequestions.push(resData);
			let availablequestionsIDs = [];
			for (const key in resData) {
				availablequestionsIDs.push(key);
			}

			const user_answ_quest_resData = await user_answered_questions_response.json();
			let answeredquestionsIDs = [];
			for (const key in user_answ_quest_resData) {
				answeredquestionsIDs.push(user_answ_quest_resData[key].question.id);
			}
			// MFC = Most Favorite Code !!!
			// Find which IDs match. That is, which questions IDs match with answered questions IDs,
			// in order to remove the questions that have been already answered, from
			// the available questions.
			const findMatchingIds = (arr1, arr2) => {
				let newAvailableQuestions = {};
				arr1.filter((item) => {
					if (!arr2.includes(item)) {
						for (const key in resData) {
							if (key === item) {
								newAvailableQuestions[key] = resData[key];
							}
						}
					}
				});

				return newAvailableQuestions;
			};

			const finalAvailableQuestions = findMatchingIds(availablequestionsIDs, answeredquestionsIDs);

			if (answeredquestionsIDs.length > 0) {
				resData = { ...finalAvailableQuestions };
			}
			const loadedQuestions = [];
			for (const key in resData) {
				loadedQuestions.push(
					new Question({
						index: resData[key].index, // for keeping the choice in cartScreen
						id: key,
						categoryIds: resData[key].categoryIds,
						ownerId: resData[key].ownerId,
						title: resData[key].title,
						// imageUrl: resData[key].imageUrl,
						difficultyLevel: resData[key].difficultyLevel,
						answer: resData[key].answer,
						choice_Alpha: resData[key].choice_Alpha,
						choice_Beta: resData[key].choice_Beta,
						choice_Gamma: resData[key].choice_Gamma,
						choice_Delta: resData[key].choice_Delta,
						right_choice: resData[key].right_choice
					})
				);
			}

			// For getting a different question in QuestionDetailScreen...
			const shuffle = (array) => {
				var currentIndex = array.length,
					temporaryValue,
					randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {
					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}

				return array;
			};

			// shuffle(loadedQuestions);
			shuffle(loadedQuestions);

			dispatch({
				type: SET_QUESTIONS,
				questions: loadedQuestions,
				// Now we see only the questions of the logged in user.
				//testing
				// adminQuestions: loadedQuestions.filter((quest) => quest.ownerId === 'eeR9esY0l8OxcxJPPA1Gp4T5Xsy1')
				adminQuestions: loadedQuestions.filter((quest) => quest.ownerId === userId)
			});
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};

export const createQuestion = (
	title,
	categoryIds,
	// imageUrl,
	difficultyLevel,
	answer,
	choice_Alpha,
	choice_Beta,
	choice_Gamma,
	choice_Delta,
	right_choice
) => {
	return async (dispatch, getState) => {
		try {
			// SET INDEX
			// Set an index so in CartScreen you can splice the transformedCartItems,
			// so the choice of the cartItems will not change when adding/subtracting
			const res = await fetch('https://en-touto-nika.firebaseio.com/questions.json');
			const resD = await res.json();
			const loadedIndexes = [];
			for (const key in resD) {
				loadedIndexes.push(resD[key].index);
			}
			const arrayForIndexes = [ ...loadedIndexes ];
			let lastIndex = arrayForIndexes.pop();

			if (typeof lastIndex === 'undefined') {
				lastIndex = -1;
			}

			// CREATE PRODUCT
			const token = getState().auth.token;
			const userId = getState().auth.userId;
			// testing
			// const response = await fetch(`https://en-touto-nika.firebaseio.com//questions.json`, {
			const response = await fetch(`https://en-touto-nika.firebaseio.com//questions.json?auth=${token}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					index: lastIndex + 1, // for keeping the choice in cartScreen
					categoryIds,
					//testing
					// ownerId: 'eeR9esY0l8OxcxJPPA1Gp4T5Xsy1',
					ownerId: userId,
					title,
					// imageUrl,
					difficultyLevel,
					answer,
					choice_Alpha,
					choice_Beta,
					choice_Gamma,
					choice_Delta,
					right_choice
				})
			});

			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η δημιουργία νέας ερώτησης δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}

			const resData = await response.json();
			// console.log(resData.name);
			dispatch({
				type: CREATE_QUESTION,
				questionData: {
					index: lastIndex + 1, // for keeping the choice in cartScreen
					id: resData.name,
					categoryIds,
					// testing
					// ownerId: 'eeR9esY0l8OxcxJPPA1Gp4T5Xsy1',
					ownerId: userId,
					title,
					answer,
					// imageUrl,
					difficultyLevel,
					choice_Alpha,
					choice_Beta,
					choice_Gamma,
					choice_Delta,
					right_choice
				}
			});
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};

export const updateQuestion = (
	id,
	title,
	categoryIds,
	// imageUrl,
	difficultyLevel,
	answer,
	choice_Alpha,
	choice_Beta,
	choice_Gamma,
	choice_Delta,
	right_choice
) => {
	return async (dispatch, getState) => {
		try {
			const userId = getState().auth.userId;
			const token = getState().auth.token;
			// testing
			// const response = await fetch(
			// `https://en-touto-nika.firebaseio.com//questions/eeR9esY0l8OxcxJPPA1Gp4T5Xsy1.json?`,
			// {
			const response = await fetch(`https://en-touto-nika.firebaseio.com//questions/${id}.json?auth=${token}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title,
					categoryIds,
					// imageUrl,
					difficultyLevel,
					answer,
					choice_Alpha,
					choice_Beta,
					choice_Gamma,
					choice_Delta,
					right_choice
				})
			});

			if (!response.ok) {
				throw new Error(
					'Δυστυχώς η ανανέωση των πληροφωριών της ερωτήσεως δεν ήταν δυνατή! Παρακαλούμε ελέγξτε τη σύνδεσή σας.'
				);
			}
			// const resData = await response.json();
			// console.log('PATCH resData.name: ', resData.name);

			dispatch({
				type: UPDATE_QUESTION,
				pid: id,
				questionData: {
					title,
					categoryIds,
					ownerId: userId,
					// imageUrl,
					difficultyLevel,
					answer,
					choice_Alpha,
					choice_Beta,
					choice_Gamma,
					choice_Delta,
					right_choice
				}
			});
		} catch (err) {
			// send to custom analytics server
			throw err;
		}
	};
};
