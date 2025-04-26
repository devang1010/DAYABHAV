import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const UrgentNeedsCard = ({ item, onRemove }) => {
  // Get priority with fallback to 1 if it doesn't exist
  const priority = item.priority ? parseInt(item.priority) : 1;
  
  // Get priority label based on priority level
  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 5: return "Critical";
      case 4: return "Urgent";
      case 3: return "High";
      case 2: return "Medium";
      default: return "Low";
    }
  };
  
  // Get color based on priority level
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 5: return "#e74c3c"; // Critical - Red
      case 4: return "#e67e22"; // Urgent - Orange
      case 3: return "#f39c12"; // High - Yellow
      case 2: return "#27ae60"; // Medium - Green
      default: return "#95a5a6"; // Low - Gray
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/ngorequirements.php?requirement_id=${item.requirement_id}`
      )

      if (response.data.status === "success") {
        onRemove(item.requirement_id);
      } else {
        console.log("Error deleting requirement:", response.data.message);
      }
    } catch (err) {
      console.error("Delete Api error:", err);
    }
  }

  return (
    <View style={[styles.card, { borderLeftColor: getPriorityColor(priority) }]}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.item_name}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>Qty: {item.quantity}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
              <Text style={styles.priorityText}>{getPriorityLabel(priority)}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.removeButton}>
          <MaterialIcons name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UrgentNeedsCard;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 6,
    width: windowWidth - 64, // Adjusting width based on screen size with padding
    alignSelf: "center",
    borderLeftWidth: 5,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 13,
    color: "#555",
  },
  priorityBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginTop: 10,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  priorityText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
  },
  removeButton: {
    backgroundColor: "#555",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});