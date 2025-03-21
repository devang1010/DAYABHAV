import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const API_BASE_URL = "http://192.168.56.92/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;

export default function DonationStatsCard({ item }) {
  const router = useRouter();

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image 
          source={{ uri: `${IMAGE_BASE_URL}${item.item_image}` }} 
          style={styles.image} 
          resizeMode="contain"
        />
        <View style={styles.details}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
            {item.item_name}
          </Text>

          {/* Show NGO details only if status is 'accepted' or 'completed' */}
          {(item.status === "Accepted" || item.status === "Completed") && (
            <View style={styles.ngoDetailsContainer}>
              <Text style={styles.ngoLabel}>NGO:</Text>
              <Text style={styles.ngoValue} numberOfLines={1} ellipsizeMode="tail">
                {item.ngoname}
              </Text>

              <Text style={styles.ngoLabel}>Address:</Text>
              <Text style={styles.ngoValue} numberOfLines={2} ellipsizeMode="tail">
                {item.address}
              </Text>

              <Text style={styles.ngoLabel}>Phone:</Text>
              <Text style={styles.ngoValue} numberOfLines={1} ellipsizeMode="tail">
                {item.phonenumber}
              </Text>
            </View>
          )}

          <Text style={styles.date}>Date: {formatDate(item.created_at)}</Text>
          
          <View style={styles.statusContainer}>
            <TouchableOpacity 
              style={[styles.statusButton, getStatusStyle(item.status)]}
              activeOpacity={0.9}
            >
              <Text style={[styles.statusText, getTextStyle(item.status)]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// Function to get button background color based on status
const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return { backgroundColor: "#FFA500" }; // Orange
    case "accepted":
      return { backgroundColor: "#4682B4" }; // Steel Blue
    case "completed":
      return { backgroundColor: "#32CD32" }; // Green
    default:
      return { backgroundColor: "#E0E0E0" }; // Default Gray
  }
};

// Function to get text color based on status
const getTextStyle = (status) => {
  return status.toLowerCase() === "pending" 
    ? { color: "#333" } 
    : { color: "#fff" };
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 6,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    resizeMode: "contain"
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ngoDetailsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  ngoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  ngoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
