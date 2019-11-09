import React from 'react';
import { TouchableOpacity, Platform, View, StyleSheet, TouchableNativeFeedback } from 'react-native';

import BoldText from '../UI/BoldText';

const CategoryGridTile = (props) => {
    let TouchComp = Platform.OS === 'android' && Platform.Version >= 21 
    ? TouchableNativeFeedback : TouchableOpacity;
    
    return (
        <View style={styles.gridItem} >
		<TouchComp style={{flex: 1}} onPress={props.onSelect}>
			<View style={{ ...styles.container, ...{ backgroundColor: props.color } }}>
				<BoldText numberOfLines={2} >
					{props.title}
				</BoldText>
			</View>
		</TouchComp>
        </View>
	);
};

const styles = StyleSheet.create({
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
