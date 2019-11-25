import React from 'react'
import {Platform, Dimensions} from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import Colours from '../../constants/Colours';

const CustomHeaderButton = (props) => {
	const width = Dimensions.get('window').width; 

    return ( 
        <HeaderButton {...props} IconComponent={Ionicons} iconSize={Math.ceil(width * 0.07)} color={Platform.OS === 'android' ? Colours.moccasin_light : Colours.maroon} />
     );
}
 
export default CustomHeaderButton; 