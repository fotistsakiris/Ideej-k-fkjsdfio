import React from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Line from '../UI/Line';
import BoldText from '../UI/BoldText';
import Colours from '../../constants/Colours';

const CartItem = (props) => {
	return (
		<View style={styles.cartItem}>
			<BoldText style={styles.mainText}>{props.title} </BoldText>
			{/* <Line style={styles.line} /> */}
			<BoldText style={styles.mainText}>
				Τιμή: {props.points}
				<Text style={styles.euro}> €</Text>
			</BoldText>
			<View style={styles.itemDataSummary}>
				<View style={styles.quantity}>
				<BoldText>Τεμ. {props.quantity}</BoldText>
				</View>
				{props.changeQuantity && (
					<View style={styles.itemData}>
						<TouchableOpacity style={styles.itemData} onPress={props.onAddProduct}>
							<Ionicons
								name={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
								size={28}
								color={Colours.maroon}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.itemData} onPress={props.onRemoveProduct}>
							<MaterialCommunityIcons name="minus" size={27} color={Colours.maroon} />
						</TouchableOpacity>
					</View>
				)}
			</View>
			<BoldText style={styles.mainText}>
				Σύνολο: {props.amount.toFixed(2)}
				<Text style={styles.euro}> €</Text>
			</BoldText>
		</View>
	);
};

const styles = StyleSheet.create({
	cartItem: {
		paddingTop: 2,
		justifyContent: 'flex-start',
		// paddingHorizontal: 2,
		backgroundColor: Colours.moccasin_light
	},
	summary: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	itemDataSummary: {
		flexDirection: 'row',
		justifyContent: 'flex-start'
		// alignItems: 'center',
		// paddingRight: 7
	},
	quantity: {
		justifyContent: 'flex-start'
	},
	itemData: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		// alignItems: 'center',
		// paddingRight: 7,
		marginHorizontal: 16
	},
	euro: {
		fontSize: 14,
		color: '#888'
	},
	mainText: {
		paddingVertical: 5,
		textAlign: 'left'
	}
});

export default CartItem;
