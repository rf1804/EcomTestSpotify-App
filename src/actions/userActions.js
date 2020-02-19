/**
 * Created by rf1804 on 19/02/2020.
 *
 * @format
 */

import * as type from '../constants/ActionTypes';
import React from 'react';
import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export const checkInternet = netStatus => {
  return {
    type: type.CHECK_INTERNET_CONNECTION,
    netStatus,
  };
};
export const setCountryData = countryData => {
  return {
    type: type.CURRENT_COUNTRY_DATA,
    countryData,
  };
};
export const showOptionsAlert = message => {
  return (dispatch, getState) => {
    dispatch(setVisible(false));
    if (Platform.OS == 'ios') {
      setTimeout(() => {
        Alert.alert(
          '',
          message,
          [
            {
              text: 'Okay',
              onPress: () => {},
            },
          ],
          {cancelable: false},
        );
      }, 600);
    } else {
      Alert.alert(
        '',
        message,
        [
          {
            text: 'Okay',
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
    }
  };
};
export const withoutAlertEnable = () => {
  return (dispatch, getState) => {
    dispatch(setVisible(false));
  };
};
export const setVisible = visible => {
  return {
    type: type.SET_VISIBLE,
    visible,
  };
};
export const saveSpotifyToken = spotifyToken => {
  return {
    type: type.SET_SPOTIFY_TOKEN,
    spotifyToken,
  };
};
export const setCountryPlaylists = countryPlaylists => {
  return {
    type: type.SET_COUNTRY_PLAYLISTS,
    countryPlaylists,
  };
};
