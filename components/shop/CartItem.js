import React from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Line from '../UI/Line';
import BoldText from '../UI/BoldText';

const CartItem = (props) => {
	return (
		<View style={styles.cartItem}>
			<BoldText style={styles.mainText}>{props.title} </BoldText>
			<View style={styles.itemData}>
				<BoldText style={styles.mainText}>{props.amount.toFixed(2)} €</BoldText>
				<Text style={styles.quantity}>Τεμ. {props.quantity} </Text>
				{props.changeQuantity && (
					<View style={styles.itemData} >
						<TouchableOpacity style={styles.itemData} onPress={props.onAddProduct}>
							<Ionicons name={Platform.OS === 'android' ? 'md-add' : 'ios-add'} size={23} color="gray" />
						</TouchableOpacity>
						<TouchableOpacity style={styles.itemData} onPress={props.onRemoveProduct}>
							<MaterialCommunityIcons name="minus" size={23} color="gray" />
						</TouchableOpacity>
					</View>
				)}
			</View>
			<Line style={styles.line} />
		</View>
	);
};

const styles = StyleSheet.create({
	cartItem: {
		paddingTop: 10,
		backgroundColor: 'white',
		justifyContent: 'flex-start',
		marginHorizontal: 20
	},
	itemData: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingRight: 15
	},
	quantity: {
		fontFamily: 'GFSNeohellenic-Regular',
		color: '#888',
		fontSize: 20,
		paddingHorizontal: 15
	},
	mainText: {
		paddingVertical: 5
	},
	line: {
		width: '70%',
		alignSelf: 'flex-start'
	}
});

export default CartItem;
