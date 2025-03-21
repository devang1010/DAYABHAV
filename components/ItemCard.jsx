import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const ItemCard = ({ item }) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <View style={styles.imgContainer}>
        <Image source={item.image} style={styles.image}/>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
    </View>
  </View>
);

export default ItemCard;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  card: {
    marginRight: 10,
    borderRadius: 15,
  },
  imgContainer: {
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  textContainer:{
    zIndex: 1,
    bottom: 50,
    width: "50%",
    height: "auto",
    backgroundColor: 'white',
    borderTopEndRadius: 30,
    borderBottomEndRadius: 30,
    background: 'transparent',
    opacity: 0.8
  },
  text: {
    fontSize: 18,
    fontWeight: "bold", 
    marginLeft: 20,
  }
});
