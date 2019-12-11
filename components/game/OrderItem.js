import React, { useState } from 'react';
import { View, Text, Platform, Button, StyleSheet } from 'react-native';

import CartItem from './CartItem';
import Colours from '../../constants/Colours';
import Card from '../UI/Card';
import CustomButton from '../UI/CustomButton';
import BoldText from '../UI/BoldText'

const OrderItem = (props) => {
	const [ showDetails, setShowDetails ] = useState(false);

	return (
		<Card style={styles.orderItem}>
			<View style={styles.summary}>
				<BoldText style={styles.date}>{props.date}</BoldText>
				<BoldText style={styles.textItems}>{props.index}η θέση</BoldText>
				<BoldText style={styles.textItems}>{props.email}</BoldText>
				<BoldText style={styles.textItems}>Βαθμολογία: {props.totalPoints}</BoldText>
				{/* {Platform.OS === 'android' ? (
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
				)} */}
			</View>
			{/* {showDetails && (
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
			)} */}
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
		justifyContent: 'space-evenly',
		alignItems: 'center',
		width: '80%',
		margin: 2
	},
	textItems: {
		marginVertical: 10
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
