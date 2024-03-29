import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { configureGoogleSignIn, getGoogleUser, createResource } from '../lib/api';
import { errorMessage, userSettings } from '../lib/support';

export default class GoogleButton extends Component {
  async componentDidMount() {
    configureGoogleSignIn();
  }

  success = (userInfo) => {
    const { saveCredentials } = this.props
    const { email } = userInfo.user
    const { accessToken } = userInfo
    let body = JSON.stringify({ user: { email, accessToken } })
    createResource(saveCredentials, this.failure, body, userSettings)
  }

  failure = (error) => {
    const { setErrors } = this.props
    switch(error.code) {
      case statusCodes.SIGN_IN_CANCELLED: {
        setErrors({ error: 'Google Oauth Sign Up/In cancelled' })
        break
      }
      case statusCodes.IN_PROGRESS: {
        setErrors({ error: 'Google Oauth Sign In in progress' })
        break
      }
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE: {
        setErrors({ error: 'please install/update google play' })
        break
      }
      default: {
        // errorMessage(error) 
      }
    }
  }

  signIn = () => {
    getGoogleUser(this.success, this.failure)
  }

  render() {
    return (
      <React.Fragment>
        <GoogleSigninButton
          style={{ width: 212, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Auto}
          onPress={this.signIn}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
