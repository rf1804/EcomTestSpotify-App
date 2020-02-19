/**
 * Created by rf1804 on 19/02/2020.
 *
 * @format
 */

import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import {registerScreens} from './registerScreens';
import configureStore from './configureStore';

const store = configureStore();

registerScreens(Provider, store);

Navigation.events().registerAppLaunchedListener(async () => {
  try {
    Navigation.setDefaultOptions({
      statusBar: {
        backgroundColor: '#fac846',
        style: 'dark',
      },
      topBar: {
        visible: false,
        drawBehind: true,
        animate: false,
      },
      layout: {
        orientation: ['portrait', 'landscape'],
      },
      animations: {
        push: {
          waitForRender: true,
        },
        setRoot: {
          waitForRender: true,
        },
        pop: {
          waitForRender: true,
        },
        setStackRoot: {
          waitForRender: true,
          enabled: true,
        },
      },
      bottomTabs: {
        visible: true,
        animate: true,
        drawBehind: false,
        backgroundColor: 'white',
        titleDisplayMode: 'alwaysShow',
      },
    });
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'EcomTestSpotify.FirstScreen',
                id: 'FirstScreen',
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.log(error, 'catchError');
  }
});
