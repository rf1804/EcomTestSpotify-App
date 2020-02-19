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
import {ScaledSheet, verticalScale, scale} from 'react-native-size-matters';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

import {Colors, Styles, Config} from '@global';

const {width, height} = Dimensions.get('window');

import * as userActions from '../actions/userActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class SecondScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      refresh: false,
      tracksList: [],
    };
    this.tracksListRef = React.createRef();
  }
  componentDidMount() {
    this.fetchTrackListPlaylistWise();
  }
  back = () => {
    Navigation.pop(this.props.componentId);
  };
  ThirdScreen = trackData => {
    let componentId = new Date();
    Navigation.push(this.props.componentId, {
      component: {
        name: 'EcomTestSpotify.ThirdScreen',
        id: String(componentId),
        passProps: {
          trackData: trackData,
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
  fetchTrackListPlaylistWise = () => {
    let {playlistData} = this.props;
    if (!this.props.user.netStatus) {
      return this.props.actions.showOptionsAlert(
        'Please check your internet connection!',
      );
    } else {
      axios
        .get(`${Config.apiUrl}playlists/${playlistData.id}/tracks`)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            this.setState({
              tracksList: response.data.items,
              initialRender: false,
            });
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
    this.fetchTrackListPlaylistWise();
  }
  renderSeperator() {
    return <View style={LocalStyles.seperator} />;
  }
  renderHeaderFooter() {
    return <View style={LocalStyles.headerFooter} />;
  }
  renderTracksLists(data) {
    let {item, index} = data;
    let {fontFamilyNormal, fontFamilyMedium, fontFamilyBold} = this.props.user;
    return (
      <TouchableOpacity
        style={LocalStyles.trackContainer}
        onPress={() => this.ThirdScreen(item)}>
        <View style={LocalStyles.trackImageContainer}>
          <FastImage
            style={LocalStyles.trackImage}
            source={{
              uri: item.track.album.images[0].url,
            }}
          />
        </View>
        <View style={LocalStyles.widthSeperator8} />
        <View style={LocalStyles.trackDetailContainer}>
          <Text
            numberOfLines={3}
            style={[
              LocalStyles.trackNameText,
              {
                width: width - scale(200).toFixed(0),
                fontFamily: fontFamilyBold,
              },
            ]}>
            {item.track.name}
          </Text>
          <Text
            numberOfLines={2}
            style={[
              LocalStyles.detailGenericText,
              {
                width: width - scale(200).toFixed(0),
                color: Colors.grey,
                fontFamily: fontFamilyMedium,
              },
            ]}>
            Artist Name:{' '}
            <Text
              style={[
                LocalStyles.detailGenericText,
                {color: Colors.textHighlight, fontFamily: fontFamilyMedium},
              ]}>
              {item.track.artists[0].name}
            </Text>
          </Text>
          <Text
            style={[
              LocalStyles.detailGenericText,
              {
                width: width - scale(200).toFixed(0),
                marginTop: verticalScale(8),
                color: Colors.grey,
                fontFamily: fontFamilyMedium,
              },
            ]}>
            Popularity:{' '}
            <Text
              style={[
                LocalStyles.detailGenericText,
                {color: Colors.textHighlight, fontFamily: fontFamilyMedium},
              ]}>
              {item.track.popularity}
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
              No Tracks Found!{'\n'}Pull down to refresh.
            </Text>
          </View>
        </View>
      );
    }
  }
  render() {
    let {refresh, tracksList} = this.state;
    let {playlistData} = this.props;
    let {
      visible,
      textAlign,
      fontFamilyNormal,
      fontFamilyMedium,
      fontFamilyBold,
      countryData,
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
          <View style={LocalStyles.headerView}>
            <View style={LocalStyles.headerSubView1}>
              <TouchableOpacity
                hitSlope={{top: 10, bottom: 10, left: 10, right: 10}}
                style={LocalStyles.backView}
                onPress={this.back}>
                <Image
                  style={LocalStyles.backImage}
                  source={require('@images/ic_back.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={LocalStyles.headerSubView2} />
            <View style={LocalStyles.headerSubView3} />
          </View>
          <View style={LocalStyles.screenDetailView}>
            <Text
              style={[LocalStyles.welcomeText, {fontFamily: fontFamilyBold}]}>
              {playlistData ? playlistData.name : ''}
            </Text>
            <Text
              style={[
                LocalStyles.welcomeSubText,
                {fontFamily: fontFamilyNormal},
              ]}>
              {playlistData ? `Total Tracks: ${playlistData.tracks.total}` : ''}
            </Text>
          </View>
          <FlatList
            ref={this.tracksListRef}
            style={Styles.container}
            keyboardShouldPersistTaps="handled"
            directionalLockEnabled={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={tracksList}
            ItemSeparatorComponent={this.renderSeperator.bind(this)}
            ListHeaderComponent={this.renderHeaderFooter.bind(this)}
            ListFooterComponent={this.renderHeaderFooter.bind(this)}
            initialNumToRender={10}
            renderItem={this.renderTracksLists.bind(this)}
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
  headerView: {
    marginTop: '8@vs',
    marginHorizontal: '16@s',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubView1: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerSubView2: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubView3: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backImage: {height: '32@vs', width: '32@vs'},
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
    marginTop: '8@vs',
    fontSize: '14@ms',
    textAlign: 'right',
    color: Colors.textColor,
    opacity: 0.8,
  },
  seperator: {height: '24@vs'},
  headerFooter: {height: '16@vs'},
  trackContainer: {
    flexDirection: 'row',
    marginHorizontal: '24@s',
    paddingVertical: '8@vs',
    alignItems: 'center',
    borderRadius: '4@vs',
    backgroundColor: Colors.lightPrimary,
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  trackImageContainer: {
    height: '101@vs',
    width: '121@vs',
    top: '-18@vs',
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
  trackImage: {
    height: '100@vs',
    width: '120@vs',
    borderRadius: '4@vs',
  },
  widthSeperator8: {width: '8@s'},
  trackDetailContainer: {
    justifyContent: 'center',
  },
  trackNameText: {
    width: '65%',
    fontSize: '15@ms',
    textAlign: 'left',
    color: Colors.textColor,
    marginBottom: '16@vs',
  },
  detailGenericText: {
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
)(SecondScreen);
