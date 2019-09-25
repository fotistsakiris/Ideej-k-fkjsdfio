import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

import Card from '../UI/Card';
import Colours from '../../constants/Colours';

const ProductItem = (props) => {
	return (
		<View style={styles.product}>
            <View style={styles.imageContainer}>
			<Image style={styles.image} source={{ uri: props.image }} />
            </View>
			<View style={styles.textContainer}>
				<Text style={styles.title}>{props.title}</Text>
			</View>
			<View style={styles.line} />
			<View style={styles.actions}>
				<Button color={Colours.chocolate} title="Λεπτομέρειες" onPress={props.onViewDetail} />
				<Text style={styles.price}>Τιμή: € {props.price.toFixed(2)}</Text>
				<Button color={Colours.chocolate} title="Στο καλάθι" onPress={props.onAddToCard} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	product: {
		shadowColor: 'black',
		shadowOpacity: 0.26,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
		borderRadius: 10,
		backgroundColor: 'white',
		height: 300,
		margin: 20
		// marginLeft: 20,
		// marginRight: 20,
		// marginTop: 5
    },
    imageContainer: {
        width: '100%',
        height: '70%',
        // borderRadius: 10,
        // overflow: 'hidden'
    },
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
		margin: 2
	},
	textContainer: {
		alignItems: 'center',
		height: '15%',
		padding: 2
	},
	title: {
		fontSize: 18,
		marginVertical: 2
	},
	line: {
		borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '40%',
        alignSelf: 'center',
	},
	price: {
		fontSize: 14,
		color: '#888'
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '15%',
		paddingHorizontal: 20
	}
});

export default ProductItem;
