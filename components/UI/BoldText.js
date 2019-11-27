import React from 'react';

import { Text, StyleSheet, Dimensions } from 'react-native';

const BoldText = (props) => {
	const width = Dimensions.get('window').width; // to set fontSize according to screen size...
	let multiplier = 0.05
	if (width > 800 ) {
		multiplier = 0.03
	}
	return <Text style={{fontSize: Math.ceil(multiplier * width), ...styles.text, ...props.style}}>{props.children}</Text>;
};

const styles = StyleSheet.create({
	text: {
		fontFamily: 'GFSNeohellenic-Bold',
		textAlign: 'center',
		// paddingBottom: 13,
        // marginBottom: 13,
	}
});

export default BoldText;
