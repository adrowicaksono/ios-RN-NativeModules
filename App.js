/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Image, Platform, StyleSheet, Text, View, Button, ActivityIndicator, NativeModules} from 'react-native';

import axios from 'axios'
import { Buffer } from 'buffer'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const FileIO = NativeModules.FileIO 

export function encodeFile (response) {
  return 'data:'+response.headers['content-type'] + ';base64,'+ Buffer.from(response.data, 'binary').toString('base64');
}
export function decodeFile (base64) {
  return {uri: base64}
} 
export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      status: null,
      image: null
    }
    this.onPress = this.onPress.bind(this)
  }

  componentDidMount(){
    console.log('didmount :', NativeModules)
    FileIO.method_name("Argument1", "Argument2");

    // FileIO.my_method((error, output) => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     console.log(output);
    //   }
    // });
    FileIO.read('myapp/downloaded.base64').then((base64)=>{
      console.log("decode image :", decodeFile(base64) )
      this.setState({
        status: 'Image Loaded',
        image: decodeFile(base64)
      });
    });
  }

  onPress() {
    this.setState({
      loading: true,
      status: null
    })

    axios({
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/HP_logo_630x630.png',
      responseType: 'arraybuffer'
    }).then(response => {
      const base64 = Buffer.from(response.data).toString('base64');
      console.log('encoded file:', encodeFile(response))
      FileIO.saveSync('myapp/downloaded.base64', encodeFile(response))
      
      // console.log(base64)
      // we get back to this later :)
      
      this.setState({
          loading: false,
          status: 'Download Finished!'
      });
    }).catch((error) => {
      console.log(error)
      this.setState({
          loading: false,
          status: 'Download Failed due to internet connectivity.'
      });
    });
  }



  render() {
    const {loading, status} = this.state;
    return (
      <View style={styles.container}>
      {this.state.image && <View style={styles.imageWrapper}>
        <Image style={styles.image} resizeMode={'contain'} source={this.state.image}/>
      </View>}
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        {loading ? <ActivityIndicator  style={styles.indicator} size={'small'}/> : (status ? <Text>{status}</Text> : <View/>)}
        <Button title={'Download'} onPress={this.onPress}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  indicator: {
    margin: 10
  },
  imageWrapper: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
  },
});
