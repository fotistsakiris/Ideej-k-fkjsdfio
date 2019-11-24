import React from 'react';

import { Text, StyleSheet, Dimensions } from 'react-native';

const BoldText = (props) => {
	const width = Dimensions.get('window').width; // to set fontSize according to screen size...
	return <Text style={{fontSize: 0.05 * width, ...styles.text, ...props.style}}>{props.children}</Text>;
};

const styles = StyleSheet.create({
	text: {
		fontFamily: 'GFSNeohellenic-Bold',
		textAlign: 'center',
	}
});

export default BoldText;
