import React from 'react';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
let widthMultiplier = 0;
let textMultiplier = 0;
let cardHeight = 0;
let cardWidth = 0;

if (width < 400) {
	cardHeight = 0.8;
	cardWidth = 0.77;
	widthMultiplier = 0.4;
	textMultiplier = 0.06;
}
if (400 < width < 800) {
	cardHeight = 0.8;
	cardWidth = 0.85;
	widthMultiplier = 0.3;
	textMultiplier = 0.05;
}
if (width > 800) {
	cardHeight = 0.65;
	cardWidth = 0.8;
	widthMultiplier = 0.2;
	textMultiplier = 0.045;
}

const DimensionsForStyle = {
	widthMultiplier,
	textMultiplier,
	cardHeight,
	cardWidth
};

export default DimensionsForStyle;
