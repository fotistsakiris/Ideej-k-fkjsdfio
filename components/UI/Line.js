import React from 'react';
import { View, StyleSheet } from 'react-native';

const Line = (props) => {
    return <View style={{...styles.line, ...props.style}} />;
}

const styles = StyleSheet.create({
	line: {
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		width: '40%',
		alignSelf: 'center',
		// marginBottom: 12,
		marginTop: 5,
		// height: '4%',
	},
})
 
export default Line;
