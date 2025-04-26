import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const NgoRequirementUserScreen = ({ item, onPress }) => {
  // Get priority with fallback to 1 if it doesn't exist
  const priority = item.priority ? parseInt(item.priority) : 1;
  
  // Get color based on priority level - now using gradients for modern look
  const getPriorityGradient = (priority) => {
    switch(priority) {
      case 5: return ["#e74c3c", "#c0392b"]; // Critical - Red gradient
      case 4: return ["#f39c12", "#e67e22"]; // Urgent - Orange gradient
      case 3: return ["#f1c40f", "#f39c12"]; // High - Yellow gradient
      case 2: return ["#2ecc71", "#27ae60"]; // Medium - Green gradient
      default: return ["#95a5a6", "#7f8c8d"]; // Low - Gray gradient
    }
  };
  
  // Get label based on priority level
  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 5: return "Critical";
      case 4: return "Urgent";
      case 3: return "High";
      case 2: return "Medium";
      default: return "Low";
    }
  };

  // Get icon based on priority (could be replaced with actual icons)
  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 5: return "⚠️";
      case 4: return "⚡";
      case 3: return "⭐";
      case 2: return "⬆️";
      default: return "•";
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.card}>
        {/* Priority indicator as a top accent bar */}
        <LinearGradient
          colors={getPriorityGradient(priority)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.priorityAccent}
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.item_name || "Unnamed Item"}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.quantity || "0"}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsLabel}>NGO:</Text>
            <Text style={styles.detailsValue} numberOfLines={1}>
              {item.ngo_name || item.ngoname || "Unknown NGO"}
            </Text>
          </View>
          
          <View style={styles.priorityContainer}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityGradient(priority)[0] }]}>
              <Text style={styles.priorityIcon}>{getPriorityIcon(priority)}</Text>
              <Text style={styles.priorityLabel}>{getPriorityLabel(priority)}</Text>
            </View>
            <Text style={styles.priorityValue}>Priority {priority}/5</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NgoRequirementUserScreen;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  cardContainer: {
    width: windowWidth - 32,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: 'hidden',
  },
  priorityAccent: {
    height: 6,
    width: '100%',
  },
  contentContainer: {
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    flex: 1,
    marginRight: 10,
  },
  badge: {
    backgroundColor: "#3498db",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center',
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
    marginBottom: 14,
  },
  detailsLabel: {
    fontSize: 16,
    color: "#7f8c8d",
    fontWeight: "500",
    marginRight: 6,
  },
  detailsValue: {
    fontSize: 16,
    color: "#34495e",
    fontWeight: "600",
    flex: 1,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  priorityIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  priorityLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  priorityValue: {
    fontSize: 15,
    color: "#7f8c8d",
    fontWeight: "600",
  },
});