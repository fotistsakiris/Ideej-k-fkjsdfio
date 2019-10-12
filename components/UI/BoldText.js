import React from 'react';

import { Text, StyleSheet } from 'react-native';

const BoldText = (props) => {
	return <Text style={{...styles.text, ...props.style}}>{props.children}</Text>;
};

const styles = StyleSheet.create({
	text: {
		fontSize: 20, 
		fontFamily: 'GFSNeohellenic-Bold',
		textAlign: 'center',
	}
});

export default BoldText;
