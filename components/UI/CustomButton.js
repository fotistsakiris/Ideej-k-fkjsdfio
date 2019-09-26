import React from 'react';
import { View, TouchableNativeFeedback, StyleSheet, Text } from 'react-native';
import Colours from '../../constants/Colours';

export default (CustomButton = (props) => {
	return (
		<TouchableNativeFeedback onPress={props.onPress} style={{ ...styles.buttonStyle, ...props.style }}>
			<View onPress={props.onPress} style={{ ...styles.buttonStyle, ...props.style }}>
				<Text style={{ ...styles.text, ...props.style }}>{props.title}</Text>
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
		backgroundColor: Colours.gr_brown_light,

		// shadowColor: '#2AC062',
		// shadowOpacity: 0.7,
		// shadowOffset: { height: 10, width: 5 },
		// shadowRadius: 20,

		elevation: 7,
	},
	text: {
        fontSize: 20,
		color: 'white',
        // textDecorationColor: Colours.chocolateRGBA,
        fontFamily: 'GFSNeohellenic-Bold'
	}
});
