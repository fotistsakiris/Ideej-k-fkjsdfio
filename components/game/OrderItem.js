import React, { useState } from 'react';
import { View, Text, Platform, Button, StyleSheet } from 'react-native';

import CartItem from './CartItem';
import Colours from '../../constants/Colours';
import Card from '../UI/Card';
import CustomButton from '../UI/CustomButton';

const OrderItem = (props) => {
	const [ showDetails, setShowDetails ] = useState(false);

	return (
		<Card style={styles.orderItem}>
			<View style={styles.summary}>
				<Text style={styles.date}>{props.date}</Text>
				<Text style={styles.totalAmount}>Σύνολο: {props.totalAmount.toFixed(2)}</Text>
				{Platform.OS === 'android' ? (
					<CustomButton
						style={styles.customButton}
						textStyle={styles.buttonText}
						title={showDetails ? 'Απόκρυψη παραγγελίας' : 'Εμφάνιση παραγγελίας'}
						onPress={() => setShowDetails((prevState) => !prevState)}
					/>
				) : (
					<Button
						color={Colours.maroon}
						title={showDetails ? 'Απόκρυψη παραγγελίας' : 'Εμφάνιση παραγγελίας'}
						onPress={() => setShowDetails((prevState) => !prevState)}
					/> 
				)}
			</View>
			{showDetails && (
				<View style={styles.detailItems}>
					{props.items.map((cartItem, index) => (
						<CartItem
							key={index}
							quantity={cartItem.quantity}
							difficultyLevel={cartItem.difficultyLevel}
							amount={cartItem.sum}
							title={cartItem.title}
						/>
					))}
				</View>
			)}
		</Card>
	);
};

const styles = StyleSheet.create({
	orderItem: {
		// margin: 20,
		// padding: 10,
		padding: 10,
		alignItems: 'center',
		width: '90%',
		justifyContent: 'center'
	},
	summary: {
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '80%',
		padding: 10
	},
	totalAmount: {
		fontFamily: 'GFSNeohellenic-Bold',
		fontSize: 22,
		paddingVertical: 10
	},
	customButton: {
		width: '75%',
		height: 50
	},
	buttonText: {
		// margin: 7,
		alignItems: 'center',
	},
	date: {
		fontFamily: 'GFSNeohellenic-Regular',
		fontSize: 16,
		color: '#888',
		paddingTop: 10
	},
	detailItems: {
		width: '80%',
		paddingBottom: 12
	}
});

export default OrderItem;
