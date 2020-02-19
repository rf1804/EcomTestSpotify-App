/**
 * Created by rf1804 on 19/02/2020.
 *
 * @format
 */

import * as type from '../constants/ActionTypes';
import {Fonts} from '@global';

const initialState = {
  netStatus: false,
  countryData: {country: 'India', cc: 'IN'},
  visible: false,
  flexDirection: 'row',
  textAlign: 'left',
  fontFamilyNormal: Fonts.fontFamilyEnNormal,
  fontFamilyMedium: Fonts.fontFamilyEnMedium,
  fontFamilyBold: Fonts.fontFamilyEnBold,
  spotifyToken: '',
  countryPlaylists: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case type.CHECK_INTERNET_CONNECTION:
      return {
        ...state,
        netStatus: action.netStatus,
      };
    case type.CURRENT_COUNTRY_DATA:
      return {
        ...state,
        countryData: action.countryData,
      };
    case type.SET_VISIBLE:
      return {
        ...state,
        visible: action.visible,
      };
    case type.SET_SPOTIFY_TOKEN:
      return {
        ...state,
        spotifyToken: action.spotifyToken,
      };
    case type.SET_COUNTRY_PLAYLISTS:
      return {
        ...state,
        countryPlaylists: action.countryPlaylists,
      };
    default:
      return state;
  }
};

export default user;
