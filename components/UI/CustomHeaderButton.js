import React from 'react'
import { HeaderButton } from 'react-navigation-header-buttons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colours from '../../constants/Colours';

const CustomHeaderButton = (props) => {
    return ( 
        <HeaderButton {...props} IconComponent={MaterialCommunityIcons} iconSize={23} color={Colours.dimgray} />
     );
}
 
export default CustomHeaderButton;