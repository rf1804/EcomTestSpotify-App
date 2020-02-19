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
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ScrollView,
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

class ThirdScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      trackDetail: '',
    };
  }
  componentDidMount() {
    this.fetchTrackDetail();
  }
  back = () => {
    Navigation.pop(this.props.componentId);
  };
  fetchTrackDetail = () => {
    let {trackData} = this.props;
    if (!this.props.user.netStatus) {
      return this.props.actions.showOptionsAlert(
        'Please check your internet connection!',
      );
    } else {
      axios
        .get(`${Config.apiUrl}tracks/${trackData.track.id}`)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            this.setState({
              trackDetail: response.data,
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
    this.fetchTrackDetail();
  }
  timeMaker = millis => {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };
  render() {
    let {refresh, trackDetail} = this.state;
    let {
      visible,
      textAlign,
      fontFamilyNormal,
      fontFamilyMedium,
      fontFamilyBold,
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
          <ScrollView
            style={Styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            {trackDetail ? (
              <View style={LocalStyles.trackDetailView}>
                <View style={LocalStyles.trackImageContainer}>
                  <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    style={LocalStyles.trackImage}
                    source={{
                      uri: trackDetail.album.images[0].url,
                    }}
                  />
                </View>
                <View style={LocalStyles.trackDetailSubView}>
                  <Text
                    style={[
                      LocalStyles.trackNameText,
                      {fontFamily: fontFamilyBold},
                    ]}>
                    {trackDetail.name}
                  </Text>
                  <Text
                    style={[
                      LocalStyles.detailGenericText,
                      {
                        marginTop: verticalScale(8),
                        color: Colors.grey,
                        fontFamily: fontFamilyMedium,
                      },
                    ]}>
                    Album:{' '}
                    <Text
                      style={[
                        LocalStyles.detailGenericText,
                        {
                          color: Colors.textHighlight,
                          fontFamily: fontFamilyMedium,
                        },
                      ]}>
                      {trackDetail.album.name}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      LocalStyles.detailGenericText,
                      {
                        marginTop: verticalScale(8),
                        color: Colors.grey,
                        fontFamily: fontFamilyMedium,
                      },
                    ]}>
                    Artists:{' '}
                    <Text
                      style={[
                        LocalStyles.detailGenericText,
                        {
                          color: Colors.textHighlight,
                          fontFamily: fontFamilyMedium,
                        },
                      ]}>
                      {trackDetail.artists.map((val, i) => {
                        return i == trackDetail.artists.length - 1
                          ? val.name
                          : val.name + ', ';
                      })}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      LocalStyles.detailGenericText,
                      {
                        marginTop: verticalScale(8),
                        color: Colors.grey,
                        fontFamily: fontFamilyMedium,
                      },
                    ]}>
                    Duration:{' '}
                    <Text
                      style={[
                        LocalStyles.detailGenericText,
                        {
                          color: Colors.textHighlight,
                          fontFamily: fontFamilyMedium,
                        },
                      ]}>
                      {this.timeMaker(trackDetail.duration_ms)}
                    </Text>
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>
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
  trackDetailView: {
    marginHorizontal: '24@s',
    marginVertical: '12@vs',
    backgroundColor: Colors.white,
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
  trackImageContainer: {
    height: '272@vs',
    justifyContent: 'center',
    borderTopLeftRadius: '4@vs',
    borderTopRightRadius: '4@vs',
  },
  trackImage: {
    height: '271@vs',
    borderTopLeftRadius: '4@vs',
    borderTopRightRadius: '4@vs',
  },
  trackDetailSubView: {
    padding: '8@vs',
  },
  trackNameText: {
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
  detailGenericText: {
    fontSize: '14@ms',
    textAlign: 'left',
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
)(ThirdScreen);
