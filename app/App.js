import React, { Component } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { AppContainer } from './Navigation';
import Permissions from 'react-native-permissions';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { locationPermission: null, latitude: '', longitude: '' };
  }

  componentDidMount = async () => {
    const { authorizationDeclined } = this.state
    Permissions.check('location', {type: 'whenInUse'}).then(response => {
      this.setState({locationPermission: response});
    }, () => {
      // console.warn(this.state.locationPermission)
    });
    this._requestPermission()
    this._setLocation()
  }

  _requestPermission = () => {
    Permissions.request('location', {type: 'whenInUse'}).then(response => {
      this.setState({locationPermission: response})
    });
  }

  _alertForLocationPermission() {
    Alert.alert(
      'Can we access your location?',
      'We need access your location to offer information tailored to your locations',
      [
        {
          text: 'No',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        this.state.locationPermission == 'undetermined'
          ? {text: 'OK', onPress: this._requestPermission}
          : {text: 'Open Settings', onPress: Permissions.openSettings},
      ],
    );
  }

  _setLocation = (cb) => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({ 
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => { 
        this._alertForLocationPermission()
        console.warn(error)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  render() {
    const { latitude, longitude } = this.state
    console.warn(latitude, longitude)
    return <AppContainer setLocation={this._setLocation} latitude={latitude} longitude={longitude} />;
  }
}

