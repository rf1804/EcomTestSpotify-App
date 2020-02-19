/**
 * Created by rf1804 on 19/02/2020.
 *
 * @format
 */

import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {Navigation} from 'react-native-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {ScaledSheet, scale} from 'react-native-size-matters';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

import {Colors, Styles, Config} from '@global';

import * as userActions from '../actions/userActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

let unsubscribe;

const {width, height} = Dimensions.get('window');

class FirstScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      refresh: false,
    };
    this.playListRef = React.createRef();
  }
  componentDidMount() {
    unsubscribe = NetInfo.addEventListener(state => {
      this.props.actions.checkInternet(state.isConnected);
    });
    this.obtainSpotifyToken();
    setInterval(() => {
      this.obtainSpotifyToken();
    }, 3590000);
  }
  componentWillUnmount() {
    if (unsubscribe) {
      unsubscribe();
    }
  }
  SecondScreen = playlistData => {
    let componentId = new Date();
    Navigation.push(this.props.componentId, {
      component: {
        name: 'EcomTestSpotify.SecondScreen',
        id: String(componentId),
        passProps: {
          playlistData: playlistData,
        },
        options: {
          bottomTabs: {
            visible: false,
            drawBehind: true,
          },
        },
      },
    });
  };
  obtainSpotifyToken = () => {
    let {initialRender} = this.state;
    axios({
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Config.spotifyClientCredentials}`,
      },
      data: encodeURI('grant_type=client_credentials'),
      url: `${Config.tokenUrl}`,
    })
      .then(response => {
        console.log(response);
        if (response.status == 200) {
          this.props.actions.saveSpotifyToken(response.data.access_token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${
            response.data.access_token
          }`;
          if (initialRender) {
            this.getCurrentCountry();
          }
        } else {
          return response.data.msg
            ? this.props.actions.showOptionsAlert(response.data.msg)
            : this.props.actions.withoutAlertEnable();
        }
      })
      .catch(error => {
        console.log(error.response);
        if (!error.response) {
          return this.props.actions.showOptionsAlert(
            'Please check your internet connection!',
          );
        } else {
          return error.response.data.msg
            ? this.props.actions.showOptionsAlert(error.response.data.msg)
            : this.props.actions.withoutAlertEnable();
        }
      });
  };
  getCurrentCountry = () => {
    if (!this.props.user.netStatus) {
      return this.props.actions.showOptionsAlert(
        'Please check your internet connection!',
      );
    } else {
      this.props.actions.setVisible(true);
      axios
        .get(`${Config.countryUrl}`)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            this.props.actions.setCountryData(response.data);
            this.fetchPlaylistCountryWise();
          } else {
            return response.data.msg
              ? this.props.actions.showOptionsAlert(response.data.msg)
              : this.props.actions.withoutAlertEnable();
          }
        })
        .catch(error => {
          console.log(error.response);
          if (!error.response) {
            return this.props.actions.showOptionsAlert(
              'Please check your internet connection!',
            );
          } else {
            return error.response.data.msg
              ? this.props.actions.showOptionsAlert(error.response.data.msg)
              : this.props.actions.withoutAlertEnable();
          }
        });
    }
  };
  fetchPlaylistCountryWise = () => {
    let {countryData} = this.props.user;
    if (!this.props.user.netStatus) {
      return this.props.actions.showOptionsAlert(
        'Please check your internet connection!',
      );
    } else {
      axios
        .get(
          `${Config.apiUrl}browse/featured-playlists?country=${countryData.cc}`,
        )
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            this.props.actions.setCountryPlaylists(
              response.data.playlists.items,
            );
            this.setState({initialRender: false});
            this.props.actions.setVisible(false);
          } else {
            return response.data.msg
              ? this.props.actions.showOptionsAlert(response.data.msg)
              : this.props.actions.withoutAlertEnable();
          }
          this.setState({refresh: false});
        })
        .catch(error => {
          console.log(error.response);
          this.setState({refresh: false});
          if (!error.response) {
            return this.props.actions.showOptionsAlert(
              'Please check your internet connection!',
            );
          } else {
            return error.response.data.msg
              ? this.props.actions.showOptionsAlert(error.response.data.msg)
              : this.props.actions.withoutAlertEnable();
          }
        });
    }
  };
  _onRefresh() {
    this.setState({refresh: true});
    this.fetchPlaylistCountryWise();
  }
  renderSeperator() {
    return <View style={LocalStyles.seperator} />;
  }
  renderHeaderFooter() {
    return <View style={LocalStyles.headerFooter} />;
  }
  renderPlayLists(data) {
    let {item, index} = data;
    let {fontFamilyNormal, fontFamilyMedium, fontFamilyBold} = this.props.user;
    return (
      <TouchableOpacity
        style={LocalStyles.playListContainer}
        onPress={() => this.SecondScreen(item)}>
        <View style={LocalStyles.playListImageContainer}>
          <FastImage
            style={LocalStyles.playListImage}
            source={{
              uri: item.images[0].url,
            }}
          />
        </View>
        <View style={LocalStyles.widthSeperator8} />
        <View style={LocalStyles.playListDetailContainer}>
          <Text
            numberOfLines={2}
            style={[
              LocalStyles.playListNameText,
              {
                width: width - scale(200).toFixed(0),
                fontFamily: fontFamilyBold,
              },
            ]}>
            {item.name}
          </Text>
          <Text
            style={[
              LocalStyles.playListTracksText,
              {
                width: width - scale(200).toFixed(0),
                color: Colors.grey,
                fontFamily: fontFamilyMedium,
              },
            ]}>
            Total Tracks:{' '}
            <Text
              style={[
                LocalStyles.playListTracksText,
                {color: Colors.textHighlight, fontFamily: fontFamilyMedium},
              ]}>
              {item.tracks.total}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  renderEmpty() {
    let {initialRender} = this.state;
    let {fontFamilyMedium} = this.props.user;
    if (initialRender) {
      return null;
    } else {
      return (
        <View style={LocalStyles.emptyImageContainer}>
          <View style={LocalStyles.emptyTextContainer}>
            <Text
              style={[LocalStyles.emptyText, {fontFamily: fontFamilyMedium}]}>
              No Playlist Found!{'\n'}Pull down to refresh.
            </Text>
          </View>
        </View>
      );
    }
  }
  render() {
    let {refresh} = this.state;
    let {
      visible,
      textAlign,
      fontFamilyNormal,
      fontFamilyMedium,
      fontFamilyBold,
      countryData,
      countryPlaylists,
    } = this.props.user;
    return (
      <View style={Styles.container}>
        <Spinner
          visible={visible}
          color={Colors.primary}
          overlayColor={Colors.spinnerOverlayColor}
          animation={Styles.spinnerAnimationType}
          cancelable={false}
        />
        <SafeAreaView style={Styles.container}>
          <View style={LocalStyles.screenDetailView}>
            <Text
              style={[LocalStyles.welcomeText, {fontFamily: fontFamilyBold}]}>
              Welcome
            </Text>
            <Text
              style={[
                LocalStyles.welcomeSubText,
                {fontFamily: fontFamilyMedium},
              ]}>
              Here is your curated featured{'\n'}playlist of{' '}
              <Text
                style={[
                  LocalStyles.welcomeSubText,
                  {fontFamily: fontFamilyBold, color: Colors.textHighlight},
                ]}>
                {countryData.country}
              </Text>
            </Text>
          </View>
          <FlatList
            ref={this.playListRef}
            style={Styles.container}
            keyboardShouldPersistTaps="handled"
            directionalLockEnabled={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={countryPlaylists}
            ItemSeparatorComponent={this.renderSeperator.bind(this)}
            ListHeaderComponent={this.renderHeaderFooter.bind(this)}
            ListFooterComponent={this.renderHeaderFooter.bind(this)}
            initialNumToRender={10}
            renderItem={this.renderPlayLists.bind(this)}
            ListEmptyComponent={this.renderEmpty.bind(this)}
            refreshing={refresh}
            onRefresh={this._onRefresh.bind(this)}
          />
          <View style={Styles.bottomSeperator} />
        </SafeAreaView>
      </View>
    );
  }
}

const LocalStyles = ScaledSheet.create({
  screenDetailView: {
    marginHorizontal: '24@s',
    marginTop: '12@vs',
    marginBottom: '12@vs',
  },
  welcomeText: {
    fontSize: '18@ms',
    textAlign: 'left',
    color: Colors.textColor,
  },
  welcomeSubText: {
    marginTop: '16@vs',
    fontSize: '14@ms',
    lineHeight: 24,
    letterSpacing: 1.5,
    textAlign: 'left',
    color: Colors.textColor,
    opacity: 0.8,
  },
  seperator: {height: '24@vs'},
  headerFooter: {height: '16@vs'},
  playListContainer: {
    flexDirection: 'row',
    marginHorizontal: '24@s',
    alignItems: 'center',
    borderRadius: '4@vs',
    backgroundColor: Colors.lightPrimary,
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  playListImageContainer: {
    height: '101@vs',
    width: '121@vs',
    top: '-10@vs',
    left: '-10@s',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: '1@vs',
    borderRadius: '4@vs',
    borderColor: Colors.borderColor,
    backgroundColor: Colors.white,
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  playListImage: {
    height: '100@vs',
    width: '120@vs',
    borderRadius: '4@vs',
  },
  widthSeperator8: {width: '8@s'},
  playListDetailContainer: {
    justifyContent: 'center',
  },
  playListNameText: {
    fontSize: '15@ms',
    textAlign: 'left',
    color: Colors.textColor,
    marginBottom: '16@vs',
  },
  playListTracksText: {
    fontSize: '14@ms',
    textAlign: 'left',
  },
  emptyImageContainer: {
    flex: 1,
  },
  emptyTextContainer: {
    marginTop: '24@vs',
  },
  emptyText: {
    fontSize: '14@ms',
    textAlign: 'center',
    color: Colors.textColor,
  },
});

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FirstScreen);
