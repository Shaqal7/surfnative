import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { styles } from './styles';
import ErrorMessage from '../components/ErrorMessage'
import Message from '../lib/message'
import { createSession } from '../lib/api'
import GoogleButton from '../components/GoogleButton'

export default class SignInScreen extends Component {
  static navigationOptions = { title: 'Sign In', }
  state = { email: '', password: '', errors: '' };

  constructor(props) {
    super(props)
    this.setErrors = this.setErrors.bind(this)
  }

  saveCredentials = async (json) => {
    const { navigation } = this.props;
    await AsyncStorage.setItem('userToken', json.authentication_token);
    await AsyncStorage.setItem('userEmail', json.email);
    navigation.navigate('App');
  }

  setErrors = (obj) => {
    this.setState({ errors: new Message(obj).errors });
  }

  createUserSession = async () => {
    const { email, password } = this.state;
    const body = JSON.stringify({ user: { email, password } })
    createSession(this.saveCredentials, this.setErrors, body)
  }

  render() {
    const { email, password, errors } = this.state;
    const { navigation } = this.props;
    return (
      <React.Fragment>
        { errors ? <ErrorMessage message={errors} /> : null }
        <View style={styles.container}>
          <Input
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={text => this.setState({ email: text })}
            value={email}
          />
          <Input
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={text => this.setState({ password: text })}
            value={password}
          />
          <Button
            title="Login"
            onPress={this.createUserSession}
            buttonStyle={styles.button}
          />
          <Button
            title="Don't have an account? Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            buttonStyle={styles.button}
          />
          <GoogleButton saveCredentials={this.saveCredentials} setErrors={this.setErrors} />
        </View>
      </React.Fragment>
    );
  }
}
