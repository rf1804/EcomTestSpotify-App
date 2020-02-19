/**
 * Created by rf1804 on 19/02/2020.
 *
 * @format
 */

import Colors from './Colors';
import {moderateScale, verticalScale} from 'react-native-size-matters';

//For TextAlign, flexDirection, fontFamily check src/reducers/user.js
//For Tab Icons check src/global/Config.js

export default {
  spinnerAnimationType: 'fade', //Anyone of these-> none, slide, fade
  tabBarLabelFontSize: moderateScale(11),
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  bottomSeperator: {
    height: verticalScale(16),
  },
};
