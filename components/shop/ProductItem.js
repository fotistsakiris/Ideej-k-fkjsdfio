import React from 'react';
import {
	View,
	Text,
	Platform,
	Image,
	Button,
	StyleSheet,
	TouchableOpacity,
	TouchableNativeFeedback
} from 'react-native';

import Card from '../UI/Card';
import Colours from '../../constants/Colours';
import CustomButton from '../UI/CustomButton';

const ProductItem = (props) => {
	let TouchableComp = TouchableOpacity;
	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableComp = TouchableNativeFeedback;
	}
	return (
		<View style={styles.product}>
			<View style={styles.touchable}>
				<TouchableComp onPress={props.onViewDetail} useForground>
					<View>
						<View style={styles.imageContainer}>
							<Image style={styles.image} source={{ uri: props.image }} />
						</View>
						<View style={styles.textContainer}>
							<Text style={styles.title}>{props.title}</Text>
						</View>
						{/* <View style={styles.line} /> */}

						{Platform.OS === 'android' ? (
							<View style={styles.actions}>
								<View>
									<CustomButton
										title="Λεπτομέρειες"
										onPress={props.onViewDetail}
									/>
								</View>
								<Text style={styles.price}>€ {props.price.toFixed(2)}</Text>
								<View>
									<CustomButton
										title="... στο καλάθι"
										onPress={props.onAddToCard}
									/>
								</View>
							</View>
						) : (
							<View style={styles.actions}>
								<View style={styles.button}>
									<Button
										color={Colours.gr_brown_light}
										title="Λεπτομέρειες"
										onPress={props.onViewDetail}
									/>
								</View>
								<Text style={styles.price}>€ {props.price.toFixed(2)}</Text>
								<View style={styles.button}>
									<Button color={Colours.gr_brown_light} title="... στο καλάθι" onPress={props.onAddToCard} />
								</View>
							</View>
						)}
					</View>
				</TouchableComp>
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
		margin: 20,
		padding: 10
	},
	touchable: {
		overflow: 'hidden',
		borderRadius: 10
	},
	imageContainer: {
		width: '100%',
		height: '65%'
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
		fontSize: 20,
		marginVertical: 6,
		fontFamily: 'GFSNeohellenic-Bold'
	},
	line: {
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		width: '40%',
		alignSelf: 'center',
		margin: 2,
		height: '2%',
	},
	price: {
		fontSize: 18,
		color: '#888',
		fontFamily: 'GFSNeohellenic-Bold'
	},
	actions: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		height: '18%',
		paddingHorizontal: 20,
	},
	button: {
		width: '50%'
	}
});

export default ProductItem;
