import React from "react";
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Text, 
  Dimensions, 
  TouchableOpacity,
  Image,
  Linking
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native-virtualized-view";
import { MaterialIcons } from '@expo/vector-icons';

import Navbar from "@/components/Navbar";
import ConnectWithUs from "@/components/ConnectWithUs";

const { width, height } = Dimensions.get('window');

const API_BASE_URL = "http://192.168.4.126/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;

const DonationDetailScreen = () => {
  const router = useRouter();
  const { 
    item_name, 
    donor, 
    contact, 
    image, 
    status, 
    quantity, 
    item_id 
  } = useLocalSearchParams();

  const handleGoBack = () => {
    router.back();
  };

  const handleCall = () => {
    if (contact) {
      Linking.openURL(`tel:${contact}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Donation Details</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <View style={styles.imageBorder}>
            <Image 
              source={{ uri: `${IMAGE_BASE_URL}${image}` }}
              style={styles.donationImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.itemName}>{item_name}</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MaterialIcons name="person" color="#4A90E2" size={20} />
            </View>
            <Text style={styles.detailText}>Donated by {donor}</Text>
          </View>

          {/* Clickable Contact Number */}
          <TouchableOpacity style={styles.detailRow} onPress={handleCall}>
            <View style={styles.detailIcon}>
              <MaterialIcons name="phone" color="#4A90E2" size={20} />
            </View>
            <Text style={[styles.detailText, styles.phoneText]}>
              {contact}
            </Text>
          </TouchableOpacity>

          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusText, 
              status === 'Pending' ? styles.pendingStatus : styles.availableStatus
            ]}>
              {status}
            </Text>
            {quantity && (
              <Text style={styles.quantityText}>
                Quantity: {quantity}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGoBack}>
            <MaterialIcons name="check" color="white" size={20} />
            <Text style={styles.primaryButtonText}>Return</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConnectWithUs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    marginTop: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageBorder: {
    borderRadius: 15,
    padding: 4,
  },
  donationImage: {
    width: width * 0.7,
    height: height * 0.3,
    borderRadius: 12,
  },
  detailCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
  phoneText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingStatus: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  availableStatus: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  quantityText: {
    fontSize: 16,
    color: '#666',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
  },
  primaryButton: {
    flex: 0.48,
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonationDetailScreen;
