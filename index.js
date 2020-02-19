/**
 * Created by rf1804 on 19/02/2020.
 *
 * @format
 */

import './src/App';
import {Platform} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';

if (Platform.OS == 'ios') {
  KeyboardManager.setToolbarPreviousNextButtonEnable(true);
  KeyboardManager.setToolbarDoneBarButtonItemText('Close');
}

console.disableYellowBox = true;
