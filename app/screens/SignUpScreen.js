import React from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { styles } from './styles';
import { ErrorMessage } from '../components/ErrorMessage';
import Message from  '../lib/message'
import { createUser } from '../lib/api'
import GoogleButton from '../components/GoogleButton'

export default class SignUpScreen extends React.Component {
  static navigationOptions = { title: 'Sign Up', };
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

  createUserRegistration = async () => {
    const { email, password } = this.state;
    const body = JSON.stringify({ user: { email, password } })
    await createUser(this.saveCredentials, this.setErrors, body)
  }

  render() {
    const { email, password, errors } = this.state;
    const { navigation } = this.props;
    return (
      <React.Fragment>
        { errors ? <ErrorMessage message={errors} /> : null }
        <View style={styles.container}>
          <Input
            placeholder="Email"
            autocapitalize="none"
            style={styles.textInput}
            onChangeText={text => this.setState({ email: text })}
            value={email}
          />
          <Input
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.textInput}
            onChangeText={text => this.setState({ password: text })}
            value={password}
          />
          <Button
            title="Sign Up"
            onPress={this.createUserRegistration}
            buttonStyle={styles.button}
          />
          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate('SignIn')}
            buttonStyle={styles.button}
          />
          <GoogleButton saveCredentials={this.saveCredentials} setErrors={this.setErrors} />
        </View>
      </React.Fragment>
    );
  }
}
