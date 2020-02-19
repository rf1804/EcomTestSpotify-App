/**
 * Created by rf1804 on 19/02/2020.
 *
 * @format
 */

import {Navigation} from 'react-native-navigation';

import FirstScreen from './screens/FirstScreen';
import SecondScreen from './screens/SecondScreen';
import ThirdScreen from './screens/ThirdScreen';

export function registerScreens(Provider, store) {
  Navigation.registerComponentWithRedux(
    'EcomTestSpotify.FirstScreen',
    () => FirstScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'EcomTestSpotify.SecondScreen',
    () => SecondScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'EcomTestSpotify.ThirdScreen',
    () => ThirdScreen,
    Provider,
    store,
  );
}
