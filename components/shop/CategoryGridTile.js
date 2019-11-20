import React from 'react';
import { TouchableOpacity, Text, Platform, View, StyleSheet, Dimensions, TouchableNativeFeedback } from 'react-native';

// import BoldText from '../UI/BoldText';

const CategoryGridTile = (props) => {
	const width = Dimensions.get('window').width; // to set fontSize according to screen size...
	let TouchComp = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

	return (
		<View style={styles.gridItem}>
			<TouchComp style={{ flex: 1 }} onPress={props.onSelect}>
				<View style={{ ...styles.container, ...{ backgroundColor: props.color } }}>
					<Text style={{fontSize: 0.05 * width, ...styles.text}} numberOfLines={2}>
						{props.title}
					</Text>
				</View>
			</TouchComp>
		</View>
	);
};

const styles = StyleSheet.create({
	text: {
		fontFamily: 'GFSNeohellenic-Bold',
		textAlign: 'left'
	},
	gridItem: {
		flex: 1,
		marginVertical: 15,
		marginHorizontal: 15,
		height: 70,
		elevation: 5,
		borderRadius: 10,
		overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
	},
	container: {
		flex: 1,
		borderRadius: 10,
		shadowColor: 'black',
		shadowOpacity: 0.6,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 10,
		padding: 5,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default CategoryGridTile;
