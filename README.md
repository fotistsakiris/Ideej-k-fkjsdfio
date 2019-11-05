This is an app for church products. In other words it's a shop-app. It is kind of a copy of this Udemy cource: 
[React Native - The Practical Guide](https://www.udemy.com/react-native-the-practical-guide/)

## Extra features added:
### The configureStore file.
### Using an object in the Models.
### In UI: the <Line />, <BoldText />
### Favorites
### A plus and a minus sign to add/subtrack products in the cartScreen.
### Two option of navigation: 1. Side Drawer or 2. Bottom Tabs.


## TODO
### DONE! fix scrollView when having a lot of items in CartScreen,
### DONE! fix bug: When logging or singing in you need to click back to the email input field other wise the passward in ommited...
### DONE! fix bug: when toggling favorite icon, the icon toggles in all products 
### DONE! put a plus/minus sign to add/remove products in the cartScreen.
### DONE! Show an alert in AdminScreen if a chosen product to be deleted is already in the cart of a client. 
### DONE! fix bug: ProductsOverViewScreen and AdminProductsScreen shows no products available just before loading them, while it should show the spinner.
### DONE! fix bug: favorite (in ProductsDetailScreen) snaps back to false if you go back to ProductsOverviewScreen and forth to ProductsDetailScreen.
### fix bug: in cartScreen the order of the products changes when you change the amount of the second...
### refresh the token so the user doesn't get automatic logged out after 1 hour.
### put LinearGradient in all screens
### fix UI for small screens

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
