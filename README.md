This is an app for Greek Orthodox Church questions. In other words it's a game-app. It started as a copy of this Udemy cource: 
[React Native - The Practical Guide](https://www.udemy.com/react-native-the-practical-guide/)

## Extra features added:
### The configureStore file.
### Using an object in the Models.
### In UI: the <Line />, <BoldText />
### Favorites...!!!
### A plus and a minus sign to add/subtrack questions in the cartScreen.
<!-- ### Two option of navigation: 1. Side Drawer or 2. Bottom Tabs. -->
### Show an alert in AdminScreen if a chosen question to be deleted is already in the cart of a client.
### Added CustomLinearGradient
### Put login/singup in sidedrawer and hide it when user is logged in.
### Hide sidedrawer button to adminScreen from normal users...
### Added GFSNeohellenic Fonts
### User's Screen with email. This should be further modified to include settings like change language, password etc...
### Ability to change difficultyLevel too.
### Dynamic UI using Dimensions width for small and big screens.
### Choose a random question to show for a chosen category!
### Admin can input 4 choices and right-answer. User can chose with switches the right answers from a multiple choise.


## TODO
### DONE! fix scrollView when having a lot of items in CartScreen,
### DONE! fix bug: When logging or singing in you need to click back to the email input field other wise the passward in ommited...
### DONE! put a plus/minus sign to add/remove questions in the cartScreen.
### DONE! Show an alert in AdminScreen if a chosen question to be deleted is already in the cart of a client. 
### DONE! fix bug: ProductsOverViewScreen and AdminQuestionsOverview shows no questions available just before loading them, while it should show the spinner.
### DONE! put LinearGradient in all screens
### DONE! fix UI for small screens
### DONE! Put login/singup in sidedrawer and hide the adminScreen from normal users...
### DONE! fix bug: favorite (in ProductsDetailScreen) snaps back to false if you go back to QuestionsOverviewScreen and forth to ProductsDetailScreen.
### DONE! fix bug: in cartScreen the choice of the questions changes when you change the amount of the second...
### DONE! change back commented code in firebase, ...Navigator and actions/choices to need token and get AuthScreen... find 'testing'
### DONE! Fix bug: Load all questions when from favoritesScreen,
### user clicks to go to DetailesScreen Other wise the app can not find wich of the availabelProducts to show.
### DONE! Hide admin button for normal users in sidedrawer...
### DONE! Load state of question, if favorite, from firebase...
### DONE! Fix bug: Jumping between different navigation groups. i.e. From FavoritesScreen to DetailsScreen.
### DONE! fix bug: Load choices, favorites per normal user...
### DONE! Add a categories screen also to adminsScreen...
### DONE! Add an alert with the categoryIds in the EditQuestionScreen
### DONE! Add difficultyLevel validation that it doesn't have commas but fullstops...
### DONE! Load questions etc per admin user...
### DONE! show dots ... when the title is to long.
### DONE! Add a user's Screen with email.
### DONE! Add alert that visitor needs to create an account in choice to make an choice.
### DONE! When admin... navigate user to AdminCategories
### DONE! regex check for difficultyLevel and imageUrl
### DONE! Remove questions that users already answered from available questions.
### DONE! Check bug with user's totalPoints after refreshing the app
### DONE! Fix bug: Showing all user's games is user's list of points... in UserScreen
### DONE! Save users data to all-users-data when no more questions
### DONE! When saving user's data to all-users-data (on Firebase) save it by user id, to each user...
### DONE! Set a timer for each question.

### Find number of questions set and according time and number to divide the sum of point to calculate grade
### Fix bug with winner's list in UserScreen
### Fix bug with header title and messages about being wrong when clicking the refresh button, in QuestionDetailScreen.
### Show player's highest score and his/her position on the list.
### Check out why we get an object from allUsersData in questions reducer, while it's an array?
### Save sign up (new) user with an index...
### Check why we see the not correct message when we press refresh
### Save user's correct and not correct answers

### Delete from All_Users_Data, old scores and keep the highest for every user.
### Every time a user clicks a category, a bundle of 10 questions is made to shufle. Look out for bug: if timers ends up and user has more questions, next time he clicks on the category he starts from the remaining questions.
### Hide show answer button and show it only if user answered the question.
### Add a 'save session' feature, where the player may have a second look on the questions.
### Fix the cards and buttons dimensions everywhere you use it.
### Add posibility to change password...
### Authentication with roles: diferent signups/logins for admis and users.
### Add some code for github security...
### Use pictures in CategoriesScreen in the Card. This, is actually taken from the Meals app.
### Refresh the token so the user doesn't get automatic logged out after 1 hour.

### Check many more in commits...

# Packages installed:
### redux react-redux react-navigation react-navigation-stack react-navigation-header-buttons, react-navigation react-navigation-tabs react-navigation react-navigation-drawer 
### react-navigation-material-bottom-tabs 
### react-native-paper
### !!! expo install react-native-gesture-handler react-native-reanimated
### expo-font
### npm install --save-dev redux-devtools-extension 
### redux-thunk
### moment (for formating dates)
### react-moment (for formating dates)
### moment-timezone (for formating dates)
### react-native-screens
### react-native-elements
### expo-linear-gradient
### react-navigation-transitions
### react-native-icons
### moment
test

### expo publish
### expo build:android -t app-bundle  
### expo fetch:android:keystore
### expo upload:android

test

# !!!
### npm config set ignore-scripts true 
