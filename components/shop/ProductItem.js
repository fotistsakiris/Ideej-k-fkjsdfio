import React from 'react';
import {
	View,
	Text,
	Platform,
	Image,
	Dimensions ,
	StyleSheet,
	TouchableOpacity,
	TouchableNativeFeedback
} from 'react-native';
// import { Icon } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

import Card from '../UI/Card';
import Line from '../UI/Line';
import Colours from '../../constants/Colours';
import CustomButton from '../UI/CustomButton';
import BoldText from '../UI/BoldText';

const ProductItem = (props) => {
	const width = Dimensions.get('window').width; // Set the height of ProductItem bigger for small screens
	let TouchableComp = TouchableOpacity;
	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableComp = TouchableNativeFeedback;
	}
	let cardHeight = 290;
	if (width < 400) {
		cardHeight = 390
	} 
	return (
		<Card style={{height: cardHeight, ...styles.product}}>
			<View style={styles.icon}>
				{/* <Icon
					size={18}
					name={props.isFavorite ? 'favorite' : 'favorite-border'}
					type="material"
					color={Colours.chocolate}
					onPress={props.onToggleFavorite}
				/> */}
				{/* <TouchableOpacity style={styles.itemData} onPress={props.onToggleFavorite}>
					<MaterialIcons name={props.isFav ? 'favorite' : 'favorite-border'} size={23} color="red" />
				</TouchableOpacity> */}
			</View>
			<View style={styles.touchable}>
				<TouchableComp onPress={props.onSelect} useForground>
					<View>
						<View style={width < 400 ? styles.imageContainerSmall : styles.imageContainer}>
							<Image style={styles.image} source={{ uri: props.image }} />
						</View>

						<View style={width < 400 ? styles.textContainerSmall :styles.textContainer}>
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
		margin: 10,
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
	imageContainerSmall: {
		width: '100%',
		height: '48%'
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
	textContainerSmall: {
		alignItems: 'center',
		height: '10%',
		padding: 2
	},
	textContainer: {
		alignItems: 'center',
		height: '18%',
		padding: 2
	},
	title: {
		marginVertical: 6
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

export default ProductItem;
