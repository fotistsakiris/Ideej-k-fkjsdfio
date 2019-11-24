import React from 'react';
import { View, TouchableNativeFeedback, StyleSheet, Text } from 'react-native';

import Colours from '../../constants/Colours';
import BoldText from '../UI/BoldText';

export default (CustomButton = (props) => {
	return (
		<TouchableNativeFeedback onPress={props.onPress} style={{ ...props.touchableStyle }}>
			<View onPress={props.onPress} style={{ ...styles.buttonStyle, ...props.style }}>
				<BoldText style={{ ...styles.text, ...props.textStyle }}>{props.title}</BoldText>
			</View>
		</TouchableNativeFeedback>
	);
});

const styles = StyleSheet.create({
	buttonStyle: {
		height: 37,
		width: '80%',
		marginHorizontal: 20,
		marginVertical: 10,
        paddingBottom: 7,
        paddingTop: 2,
        paddingLeft: 7,
        paddingRight: 7,
		borderRadius: 15,
		alignSelf: 'center',
		alignItems: 'center',
		backgroundColor: Colours.maroon,

		// shadowColor: '#2AC062',
		// shadowOpacity: 0.7,
		// shadowOffset: { height: 10, width: 5 },
		// shadowRadius: 20,

		elevation: 7,
	},
	text: {
		color: Colours.moccasin_light,
		textAlign: 'center'
        // textDecorationColor: Colours.maroonRGBA,
	}
});
