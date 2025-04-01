import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import NgoFooter from "@/components/NgoFooter";
import ConnectWithUs from "@/components/ConnectWithUs";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const NgoProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [ngo, setNgo] = useState(null);
  const [ngoId, setNgoId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getNgoId = async () => {
      try {
        const storedNgoId = await AsyncStorage.getItem("ngo_id");
        if (storedNgoId) {
          setNgoId(storedNgoId);
          fetchNgoData(storedNgoId);
        } else {
          console.error("No NGO ID found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error retrieving NGO ID:", error);
      }
    };
    getNgoId();
  }, []);

  const fetchNgoData = async (ngoId) => {
    try {
      const response = await axios.get(`http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/getngos.php?ngo_id=${ngoId}`);
      if (response.data.status === "success") {
        setNgo(response.data.ngo);
      } else {
        console.error("Error fetching NGO data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching NGO data:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/updatengoprofile.php`, {
        ngo_id: ngoId,
        ngoname: ngo.ngoname,
        address: ngo.address,
        phonenumber: ngo.phonenumber,
        email: ngo.email
      });

      if (response.data.status === "success") {
        Alert.alert("Success", "Profile updated successfully.");
        setIsEditing(false);
        fetchNgoData(ngoId);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error updating NGO data:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleChange = (field, value) => {
    setNgo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("ngo_id");
    router.replace("/Screens/Auth/LoginScreen");
  };

  const handleDelete = async () => {
    Alert.alert("Delete Profile", "Are you sure you want to delete your profile?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            const response = await axios.delete(
              "http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/deletengo.php",
              { data: { ngo_id: ngoId } }
            );
  
            if (response.data.status === "success") {
              Alert.alert("Deleted", "Your profile has been deleted.");
              await AsyncStorage.removeItem("ngo_id");
              router.replace("/Screens/Auth/LoginScreen");
            } else {
              Alert.alert("Error", response.data.message);
            }
          } catch (error) {
            console.error("Error deleting NGO profile:", error);
            Alert.alert("Error", "Failed to delete profile.");
          }
        }
      }
    ]);
  };
  
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView>
      <LinearGradient colors={['#4682B4', '#6CA6CD']} style={styles.header}>
        <Text style={styles.title}>NGO Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Ionicons 
            name={isEditing ? "save-outline" : "pencil-outline"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {ngo ? (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Organization Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={ngo.ngoname}
                  onChangeText={(text) => handleChange('ngoname', text)}
                />
              ) : (
                <Text style={styles.text}>{ngo.ngoname}</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={ngo.address}
                  onChangeText={(text) => handleChange('address', text)}
                  multiline
                />
              ) : (
                <Text style={styles.text}>{ngo.address}</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Contact Details</Text>
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={ngo.phonenumber}
                    onChangeText={(text) => handleChange('phonenumber', text)}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={styles.input}
                    value={ngo.email}
                    onChangeText={(text) => handleChange('email', text)}
                    keyboardType="email-address"
                  />
                </>
              ) : (
                <>
                  <Text style={styles.text}>{ngo.phonenumber}</Text>
                  <Text style={styles.text}>{ngo.email}</Text>
                </>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LinearGradient
                  colors={['#4682B4', '#4682B4']}
                  style={styles.gradientButton}
                >
                  <Ionicons name="log-out-outline" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Log Out</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <LinearGradient
                  colors={['#FF6347', '#FF4500']}
                  style={styles.gradientButton}
                >
                  <Ionicons name="trash-outline" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Delete Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading NGO data...</Text>
        )}
      </ScrollView>
      </ScrollView>
      <ConnectWithUs />
      {/* <NgoFooter /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    marginTop: 100,
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4682B4',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4682B4',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F0F8FF',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  logoutButton: {
    marginBottom: 15,
  },
  deleteButton: {},
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#4682B4',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NgoProfile;