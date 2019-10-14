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
import { Icon } from 'react-native-elements';

import Card from '../UI/Card';
import Line from '../UI/Line';
import Colours from '../../constants/Colours';
import CustomButton from '../UI/CustomButton';
import BoldText from '../UI/BoldText';

const ProductItem = (props) => {
	let TouchableComp = TouchableOpacity;
	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableComp = TouchableNativeFeedback;
	}
	return (
		<Card style={styles.product}>
			<View style={styles.icon}>
				<Icon
					size={18}
					name={props.isFavorite ? 'favorite' : 'favorite-border'}
					type="material"
					color={Colours.chocolate}
					onPress={props.onToggleFavorite}
				/>
			</View>
			<View style={styles.touchable}>
				<TouchableComp onPress={props.onSelect} useForground>
					<View>
						<View style={styles.imageContainer}>
							<Image style={styles.image} source={{ uri: props.image }} />
						</View>

						<View style={styles.textContainer}>
							<BoldText style={styles.title}>{props.title}</BoldText>
						</View>

						<Line />
						{props.children}
					</View>
				</TouchableComp>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	product: {
		height: 290,
		margin: 20,
		padding: 10,
		backgroundColor: Colours.lightseagreen 
	},
	icon: {
		alignSelf: 'center',
		margin: 2
	},
	touchable: {
		overflow: 'hidden',
		borderRadius: 10
	},
	imageContainer: {
		width: '100%',
		height: '62%'
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
		marginVertical: 6
	},
	price: {
		fontSize: 18,
		color: '#888'
	},
	actions: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		height: '18%',
		paddingHorizontal: 20
	},
	button: {
		width: '50%'
	}
});

export default ProductItem;
