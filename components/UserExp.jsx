import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UserExp = ({ userExpData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.message}>{userExpData.message}</Text>
        <Text style={styles.user}>{userExpData.user}</Text>
      </View>
    </View>
  );
};

export default UserExp;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
  },
  card: {
    width: 300,
    height: 140,
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    marginRight: 30,
    marginLeft: 20
  },
  message: {
    fontSize: 16,
    color: "black",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  user: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4682B4",
  },
});
