import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const DonationDetailCard = ({ item, donor, contact, image, status, onAccept }) => {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.itemName}>{item}</Text>
        <Text style={styles.donorName}>Donor: {donor}</Text>
        <Text style={styles.contact}>Contact: {contact}</Text>
        <Text style={styles.status}>Status: {status.toUpperCase()}</Text>
        
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={[styles.button, styles.accept]} onPress={onAccept} >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={[styles.button, styles.decline]} onPress={() => router.push("/Screens/NGO/Donations/AllDonationsScreen")}>
            <Text style={styles.buttonText}>Return</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DonationDetailCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    alignItems: 'center',
    width: "100%", // Ensure full width
  },
  image: {
    width: "100%",
    height: 200, // Fixed height for consistency
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "contain", // Ensures the image covers the area without distortion
  },
  details: {
    width: '100%',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  donorName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 2,
  },
  contact: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  accept: {
    backgroundColor: '#28a745',
  },
  decline: {
    backgroundColor: '#dc3545',
  },
  received: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
