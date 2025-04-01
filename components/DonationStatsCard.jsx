import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = "http://192.168.46.163/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;
const DELETE_API_URL = `${API_BASE_URL}/User/itemdonation.php`;

export default function DonationStatsCard({ item, onDeleteSuccess }) {
  const router = useRouter();

  // Normalize status to ensure consistent case handling
  const normalizedStatus = item.status ? item.status.toLowerCase() : "";

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${DELETE_API_URL}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: item.item_id }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.status === "success") {
        Alert.alert("Success", "Donation deleted successfully!");
        if (onDeleteSuccess) {
          onDeleteSuccess(item.item_id);
        }
      } else {
        Alert.alert("Error", data.message || "Failed to delete donation.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error("Delete error:", error);
    }
  };
  
  return (
    <View style={styles.cardContainer}>
      <View style={[
        styles.card,
        (normalizedStatus === "accepted" || normalizedStatus === "completed") && styles.acceptedCard
      ]}>
        {/* Status Badge - Only for accepted and completed statuses */}
        {(normalizedStatus === "accepted" || normalizedStatus === "completed") && (
          <View style={[
            styles.statusBadge, 
            getStatusStyle(normalizedStatus)
          ]}>
            <Text style={[styles.statusBadgeText, getTextStyle(normalizedStatus)]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
            </Text>
          </View>
        )}

        {/* Delete Icon (only visible if status is pending) */}
        {normalizedStatus === "pending" && (
          <TouchableOpacity style={styles.deleteIcon} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={30} color="#FF3B30" />
          </TouchableOpacity>
        )}

        <View style={styles.contentContainer}>
          <Image 
            source={{ uri: `${IMAGE_BASE_URL}${item.item_image}` }} 
            style={styles.image} 
            resizeMode="contain"
          />
          
          <View style={styles.details}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.item_name}
            </Text>
            
            <Text style={styles.date}>Donated on: {formatDate(item.created_at)}</Text>
            
            {/* Show status as text for pending items */}
            {normalizedStatus === "pending" && (
              <View style={styles.statusContainer}>
                <TouchableOpacity 
                  style={[styles.statusButton, getStatusStyle(normalizedStatus)]}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.statusText, getTextStyle(normalizedStatus)]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Show NGO details only if status is 'accepted' or 'completed' */}
        {(normalizedStatus === "accepted" || normalizedStatus === "completed") && (
          <View style={styles.ngoDetailsContainer}>
            <View style={styles.ngoHeader}>
              <Ionicons name="business-outline" size={20} color="#4682B4" />
              <Text style={styles.ngoTitle}>NGO Information</Text>
            </View>
            
            <View style={styles.ngoDetailRow}>
              <Text style={styles.ngoLabel}>Organization:</Text>
              <Text style={styles.ngoValue} numberOfLines={1} ellipsizeMode="tail">
                {item.ngoname}
              </Text>
            </View>

            <View style={styles.ngoDetailRow}>
              <Text style={styles.ngoLabel}>Address:</Text>
              <Text style={styles.ngoValue} numberOfLines={2} ellipsizeMode="tail">
                {item.address}
              </Text>
            </View>

            <View style={styles.ngoDetailRow}>
              <Text style={styles.ngoLabel}>Phone:</Text>
              <Text style={styles.ngoValue} numberOfLines={1} ellipsizeMode="tail">
                {item.phonenumber}
              </Text>
            </View>
            
            {normalizedStatus === "accepted" && (
              <View style={styles.deliveryInstructions}>
                <Ionicons name="information-circle-outline" size={18} color="#4682B4" />
                <Text style={styles.deliveryText}>
                  Please deliver your donation to the NGO address shown above.
                </Text>
              </View>
            )}
            
            {normalizedStatus === "completed" && (
              <View style={styles.thankYouContainer}>
                <Ionicons name="heart" size={18} color="#32CD32" />
                <Text style={styles.thankYouText}>
                  Thank you for your generous donation!
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// Function to get button background color based on status
const getStatusStyle = (normalizedStatus) => {
  switch (normalizedStatus) {
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
const getTextStyle = (normalizedStatus) => {
  return normalizedStatus === "pending" 
    ? { color: "#333" } 
    : { color: "#fff" };
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#eee',
  },
  acceptedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4682B4',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    padding: 5,
    zIndex: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#f9f9f9',
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
  ngoDetailsContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ngoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ngoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4682B4',
    marginLeft: 8,
  },
  ngoDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  ngoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    width: 100,
  },
  ngoValue: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    fontWeight: '500',
  },
  deliveryInstructions: {
    flexDirection: 'row',
    backgroundColor: '#E0F0FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 0,
    // alignItems: 'flex-start',
  },
  deliveryText: {
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 8,
    flex: 1,
  },
  thankYouContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0FFE0',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 14,
    color: '#008800',
    marginLeft: 8,
    fontWeight: '500',
  },
});