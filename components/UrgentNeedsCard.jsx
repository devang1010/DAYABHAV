import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const UrgentNeedsCard = ({ item, onRemove }) => {

  const handleDelete = async () => {
    try {
      const resposne = await axios.delete(
        `http://192.168.4.126/phpProjects/donationApp_restapi/api/Ngo/ngorequirements.php?requirement_id=${item.requirement_id}`
      )

      if (resposne.data.status === "success") {
        onRemove(item.requirement_id);
      } else {
        console.log("Error deleting requirement:", resposne.data.message);
      }
    } catch (err) {
      console.error("Delete Api error:", err);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={handleDelete} style={styles.removeButton}>
        <MaterialIcons name="delete" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default UrgentNeedsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ddd",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  textContainer: {
    marginRight: "auto"
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginRight: "auto"
  },
  removeButton: {
    flexDirection: "row",
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
