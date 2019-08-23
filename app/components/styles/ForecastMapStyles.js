import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  arrow: {
    position: "absolute", 
    top: Dimensions.get("window").height, 
    left: 0,
    width: 200, 
    height: 200,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 100,
    marginRight: 100,
  },
})
