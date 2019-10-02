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
		margin: 2,
		height: '2%',
	},
})
 
export default Line;
