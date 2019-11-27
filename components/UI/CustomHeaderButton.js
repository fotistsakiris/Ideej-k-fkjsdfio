import React from 'react'
import {Platform, Dimensions} from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import Colours from '../../constants/Colours';

const CustomHeaderButton = (props) => {
    const width = Dimensions.get('window').width; 
    let buttonMultiplier = 0.07
    if (width > 800) {
        buttonMultiplier = 0.03
    }

    return ( 
        <HeaderButton {...props} IconComponent={Ionicons} iconSize={Math.ceil(width * buttonMultiplier)} color={Platform.OS === 'android' ? Colours.moccasin_light : Colours.maroon} />
     );
}
 
export default CustomHeaderButton; 