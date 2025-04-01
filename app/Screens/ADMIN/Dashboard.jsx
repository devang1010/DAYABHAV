import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';

import UserList from "@/components/UserList";
import NgoList from "@/components/NgoList";

const { width } = Dimensions.get('window');

const DashboardCard = ({ icon, title, value, color }) => (
  <View style={[styles.dashboardCard, { borderLeftColor: color }]}>
    <MaterialIcons name={icon} size={40} color={color} style={styles.cardIcon} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  </View>
);

const Dashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    finalDonations: 0,
    totalItems: 0,
    totalDonors: 0,
    totalNgos: 0
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.46.163/phpProjects/donationApp_restapi/api/Admin/adminstats.php"
        )

        if (response.data.status === "success") {
          setDashboardData({
            finalDonations: response.data.finalDonationCount,
            totalItems: response.data.totalItemsCount,
            totalDonors: response.data.userCount,
            totalNgos: response.data.ngoCount
          })
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Api error: ", error);
      }
    }

    fetchAllData();
  }, [])

  const logoutHandler = () => {
    router.replace("/Screens/Auth/LoginScreen");
  };

  const [activeTab, setActiveTab] = useState('Users');

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Users':
        return <UserList />;
      case 'Ngos':
        return <NgoList />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
            <MaterialIcons name="logout" size={24} color="#e74c3c" />
            {/* <Text style={styles.logoutText}>Logout</Text> */}
          </TouchableOpacity>
        </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
      
        <View style={styles.cardContainer}>
          <DashboardCard 
            icon="rocket" 
            title="Final Donation Items" 
            value={dashboardData.finalDonations} 
            color="#4a90e2" 
          />
          <DashboardCard 
            icon="category" 
            title="Total Donation Items" 
            value={dashboardData.totalItems} 
            color="#50c878" 
          />
          <DashboardCard 
            icon="people" 
            title="Total Donors" 
            value={dashboardData.totalDonors} 
            color="#ff6b6b" 
          />
          <DashboardCard 
            icon="business" 
            title="Total NGOs" 
            value={dashboardData.totalNgos} 
            color="#ffa726" 
          />
        </View>

        <View style={styles.tabContainer}>
          <View style={styles.tabHeader}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'Users' && styles.activeTab
              ]}
              onPress={() => setActiveTab('Users')}
            >
              <Text style={[
                styles.tabText, 
                activeTab === 'Users' && styles.activeTabText
              ]}>Donors</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'Ngos' && styles.activeTab
              ]}
              onPress={() => setActiveTab('Ngos')}
            >
              <Text style={[
                styles.tabText, 
                activeTab === 'Ngos' && styles.activeTabText
              ]}>NGOs</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tabContent}>
            {renderTabContent()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  container: {
    flex: 1,
    marginTop: 70
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  dashboardCard: {
    width: width / 2 - 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tabContainer: {
    margin: 10,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    // backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 5,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    opacity: 0.8,
    borderColor: "#4A90E2"
  },
  activeTab: {
    backgroundColor: '#4a90e2',
    opacity: 1
  },
  tabText: {
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabContent: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderRadius: 10,
    padding: 15,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Dashboard;