import React from 'react';
import {
	View,
	Text,
	Platform,
	Image,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	TouchableNativeFeedback
} from 'react-native';
// import { Question } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

import Card from '../UI/Card';
import Line from '../UI/Line';
import Colours from '../../constants/Colours';
import CustomButton from '../UI/CustomButton';
import BoldText from '../UI/BoldText';

const QuestionItem = (props) => {
	const { width, height } = Dimensions.get('window');
	// let widthMultiplier = 0.8
	// let heightMultiplier = 0.5
	let cardHeight = 0;
	let cardWidth = 0;
	let imageMultiplier = 0;
	let textMultiplier = 0;

	if (width <= 400 && width < 800) {
		cardHeight = 0.75;
		cardWidth = 0.77;
		textMultiplier = 0.06;
		imageMultiplier = 0.5;
	}
	if (width < 800 && width > 400) {
		cardHeight = 0.38;
		cardWidth = 0.85;
		textMultiplier = 0.055;
		imageMultiplier = 0.4;
	}
	if (width > 800) {
		cardHeight = 0.65;
		cardWidth = 0.8;
		textMultiplier = 0.04;
		imageMultiplier = 0.5;
	}
	let TouchableComp = TouchableOpacity;
	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableComp = TouchableNativeFeedback;
	}

	return (
		<Card
			style={{ height: Math.ceil(cardHeight * height), width: Math.ceil(cardWidth * width), ...styles.question }}
		>
			{/* <View style={styles.icon}> */}
			{/* <Question
					size={18}
					name={props.isFavorite ? 'favorite' : 'favorite-border'}
					type="material"
					color={Colours.maroon}
					onPress={props.onToggleFavorite}
				/> */}
			{/* <TouchableOpacity style={styles.itemData} onPress={props.onToggleFavorite}>
					<MaterialIcons name={props.isFav ? 'favorite' : 'favorite-border'} size={23} color="red" />
				</TouchableOpacity> */}
			{/* </View> */}
			<View style={styles.touchable}>
				<TouchableComp onPress={props.onSelect} useForground>
					<View>
						<View style={width < 400 ? styles.imageContainerSmall : width < 800 ? styles.imageContainer800 : styles.imageContainer}>
							<Image
								style={{
									width: Math.ceil(width * imageMultiplier),
									height: Math.ceil(height * imageMultiplier),
									...styles.image
								}}
								source={{ uri: props.image }}
							/>
						</View>

						<View style={width < 400 ? styles.textContainerSmall : width < 800 ? styles.textContainer800 : styles.textContainer}>
							<Text style={{ fontSize: Math.ceil(textMultiplier * width), ...styles.title }} numberOfLines={1}>
								{props.title}
							</Text>
							{/* <BoldText style={styles.title}>{props.title}</BoldText> */}
							<Line />
						</View>

						{props.children}
					</View>
				</TouchableComp>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	question: {
		margin: 10,
		padding: 10,
		backgroundColor: Colours.moccasin_light
	},
	// icon: {
	// 	alignSelf: 'center',
	// 	margin: 2
	// },
	touchable: {
		overflow: 'hidden',
		borderRadius: 10
	},
	imageContainerSmall: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '60%'
	},
	imageContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '75%'
	},
	imageContainer800: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '70%'
	},
	image: {
		// width: '100%',
		// height: '100%',
		resizeMode: 'contain',
		marginTop: 2
	},
	textContainerSmall: {
		alignItems: 'center',
		height: '15%',
		padding: 2
	},
	textContainer: {
		alignItems: 'center',
		height: '15%',
		padding: 2
	},
	textContainer800: {
		alignItems: 'center',
		height: '20%',
		padding: 2
	},
	title: {
		// marginTop: 6,
		// alignItems: 'center',
		// justifyContent: 'center',
		textAlign: 'center',
		fontFamily: 'GFSNeohellenic-Bold',
		textAlign: 'left'
	},
	price: {
		fontSize: 18,
		color: '#888'
	},
	// actions: {
	// 	flexDirection: 'row',
	// 	alignSelf: 'center',
	// 	alignItems: 'center',
	// 	height: '30%',
	// 	paddingHorizontal: 20,
	// },
	button: {
		width: '50%'
	}
});

export default QuestionItem;
