import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import CartItem from './CartItem';
import Colours from '../../constants/Colours';
import Card from '../UI/Card';

const OrderItem = (props) => {
	const [ showDetails, setShowDetails ] = useState(false);
	return (
		<Card style={styles.orderItem}>
			<View style={styles.summary}>
				<Text style={styles.date}>{props.date}</Text>
				<Text style={styles.totalAmount}>Σύνολο: {props.amount.toFixed(2)}</Text>
			</View>
			<Button
				title={showDetails ? 'Απόκρυψη παραγγελίας' : 'Εμφάνιση παραγγελίας'}
				color={Colours.chocolate}
				onPress={() => setShowDetails((prevState) => !prevState)}
			/>
			{showDetails && (
				<View style={styles.detailItems}>
					{props.items.map((cartItem) => (
						<CartItem
							key={cartItem.id}
							quantity={cartItem.quantity}
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
		margin: 20,
		padding: 10,
		alignItems: 'center',
	},
	summary: {
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '80%'
	},
	totalAmount: {
		fontFamily: 'GFSNeohellenic-Bold',
		fontSize: 22,
		paddingVertical: 10
	},
	date: {
		fontFamily: 'GFSNeohellenic-Regular',
		fontSize: 16,
		color: '#888',
		paddingVertical: 10
	},
	detailItems: {
		width: '80%'
	}
});

export default OrderItem;
