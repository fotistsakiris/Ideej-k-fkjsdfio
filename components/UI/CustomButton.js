import React from 'react';
import { View, TouchableNativeFeedback, StyleSheet, Dimensions } from 'react-native';

import Colours from '../../constants/Colours';
import BoldText from '../UI/BoldText';

export default (CustomButton = (props) => {
	const {width, height} = Dimensions.get('window'); // Set the height of QuestionItem bigger for small screens
	let heightMultiplier = 0.05
	let widthMultiplier = 0.2
	if (width > 800 ) {
		heightMultiplier = 0.04
		widthMultiplier = 0.12
	}
	return (
		<TouchableNativeFeedback onPress={props.onPress} style={{ ...props.touchableStyle }}>
			<View onPress={props.onPress} 
			style={{ height: height * heightMultiplier, width: width * widthMultiplier,  ...styles.buttonStyle, ...props.style }}>
				<BoldText style={{ ...styles.text, ...props.textStyle }}>{props.title}</BoldText>
			</View>
		</TouchableNativeFeedback>
	);
});

const styles = StyleSheet.create({
	buttonStyle: {
		// height: 37,
		// width: '80%',
		// marginHorizontal: 20,
		marginVertical: 5,
        paddingBottom: 3,
        // paddingHorizontal: 7,
		borderRadius: 15,
		alignSelf: 'center',
		// alignItems: 'center',
		backgroundColor: Colours.maroon,

		// shadowColor: '#2AC062',
		// shadowOpacity: 0.7,
		// shadowOffset: { height: 10, width: 5 },
		// shadowRadius: 20,

		elevation: 7,
	},
	text: {
		color: Colours.moccasin_light,
		textAlign: 'center',
        // paddingBottom: 13,
        // marginBottom: 13,

        // textDecorationColor: Colours.maroonRGBA,
	}
});
