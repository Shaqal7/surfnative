/* eslint no-underscore-dangle: 0 */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
import React, { Component } from 'react';
import { StatusBar, View, Text, FlatList, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { Container, Content } from 'native-base';
import Dimensions from 'Dimensions';
import Orientation from 'react-native-orientation-locker';
import Swiper from 'react-native-swiper';
import { NavigationEvents } from 'react-navigation';
import { MenuButtons, Item } from '../components/MenuButtons';
import Location from '../components/Location';
import Post from '../components/Post';
import { styles } from './styles';
import { getPosts, errorMessage } from '../lib/api'

export default class PostsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    headerMode: null 
  };

  constructor(props){
    super(props);
    this.state = { data: '', page: 1, refreshing: false, latitude: '', longitude: '' };
    this.windowHeight = (Dimensions.get('window').height - 240) / 2;
  }

  componentWillMount() {
    this._setLocation()
  }

  addData = (json) => {
    const { data } = this.state
    this.setState({ data: [...data, ...json], refreshing: false })
  }

  setData = (json) => {
    const { data } = this.state
    this.setState({ data: json, refreshing: false })
  }

  _setLocation = function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ 
          latitude: position.coords.latitude, 
          longitude: position.coords.longitude, 
        }, () => this._handleRefresh());
      },
      (error) => { 
        Alert.alert(
          'Location Services',
          'Please enable manually location services from your phone settings',
          [{text: 'Dismiss'}],
          {cancelable: true},
        );
        this._handleRefresh();
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  _handleRefresh = () => {
    this.setState({ page: 1, refreshing: true, }, () => {
      getPosts(this.setData, this.params)
    })
  }

  _handleLoadMore = () => {
    const { page } = this.state
    this.setState({ page: page + 1, }, () => {
      getPosts(this.addData, this.params)
    })
  }

  get params () {
    const { page, longitude, latitude } = this.state;
    return `?page=${page}&per_page=3&longitude=${longitude}&latitude=${latitude}`
  }

  _onEndReached = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      this._handleLoadMore()
      this.onEndReachedCalledDuringMomentum = true;
    }
  };

  //<NavigationEvents onWillFocus={payload => this._handleRefresh() } />
  
  render() {
    const { navigation } = this.props;
    const { data } = this.state;
    return (
      <Swiper 
        showsPagination={false} 
        loop={false}
        index={1}
      >
        <View>
          <Text>Top View</Text>
        </View>
        <View style={{flex:1}}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <FlatList
            data={this.state.data} 
            keyExtractor={(item, index) => index.toString() }
            refreshing={this.state.refreshing}
            onRefresh={this._handleRefresh}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            pagingEnabled={true}
            renderItem={({ item, index }) => (
              <Post key={index} post={item} height={this.windowHeight} />
            )}
          />
          <Icon
            containerStyle={styles.buttonLeft}
            name='location-pin' 
            type='entypo'
            size={40}
            color='#ffffff'
            onPress={() => navigation.navigate('New')}
          />
          <Text style={styles.textLeft}>Map</Text>
          <Icon
            containerStyle={styles.buttonAbsolute}
            name='ios-radio-button-off'
            type='ionicon'
            size={70}
            color='#ffffff'
            onPress={() => navigation.navigate('New')}
          />
          <Icon
            containerStyle={styles.buttonRight}
            name='grain' 
            size={40}
            color='#ffffff'
            onPress={() => navigation.navigate('New')}
          />
          <Text style={styles.textRight}>Discover</Text>
        </View>
        <View>
          <Text>View on the bottom</Text>
        </View>
      </Swiper>
    );
  }
}
