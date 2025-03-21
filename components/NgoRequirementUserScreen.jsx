import { StyleSheet, Text, View } from "react-native";
import React from "react";

const NgoRequirementUserScreen = ({ item }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.quantity}>Quantity Needed: {item.quantity}</Text>
    </View>
  );
};

export default NgoRequirementUserScreen;

const styles = StyleSheet.create({
    card: {
        width: "auto",
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 3,
      },
      itemName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4682B4",
      },
      ngoName: {
        opacity: 0.5,
        marginVertical: 3
      },
      quantity: {
        fontSize: 16,
        color: "#555",
        marginTop: 5,
        fontWeight: "bold"
      },
});
