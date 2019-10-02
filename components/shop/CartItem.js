import React from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Line from '../UI/Line';

const CartItem = (props) => {
	return (
		<View style={styles.cartItem}>
			<Text style={styles.mainText}>{props.title} </Text>
			<View style={styles.itemData}>
				<Text style={styles.mainText}>€ {+props.amount.toFixed(2)} </Text>
				<Text style={styles.quantity}>Τεμ. {props.quantity} </Text>
				{/* deletable is becuase we do not want to render the icon in OrderItem */}
				{props.deletable && (
					<TouchableOpacity style={styles.deleteButton} onPress={props.onRemove}>
						<Ionicons name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'} size={23} color="red" />
					</TouchableOpacity>
				)}
			</View>
			<Line style={styles.line}/>
		</View>
	);
};

const styles = StyleSheet.create({
	cartItem: {
		padding: 10,
		backgroundColor: 'white',
		justifyContent: 'flex-start',
		marginHorizontal: 20
	},
	itemData: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	quantity: {
		fontFamily: 'GFSNeohellenic-Regular',
		color: '#888',
		fontSize: 20,
		paddingHorizontal: 10
	},
	mainText: {
		fontFamily: 'GFSNeohellenic-Bold',
		fontSize: 20,
		paddingHorizontal: 10
    },
    line: {
		width: '70%',
		alignSelf: 'flex-start',		
	},
});

export default CartItem;
