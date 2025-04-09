import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Notification = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(storedUserId);
          fetchNotifications(storedUserId);
        }
      } catch (error) {
        console.error('Error getting userId:', error);
      }
    };

    getUserId();
  }, []);

  // Get read notification IDs from AsyncStorage
  const getReadNotifications = async () => {
    try {
      const readNotifs = await AsyncStorage.getItem('read_notifications');
      return readNotifs ? JSON.parse(readNotifs) : [];
    } catch (error) {
      console.error('Error getting read notifications:', error);
      return [];
    }
  };

  // Save read notification IDs to AsyncStorage
  const saveReadNotification = async (notificationId) => {
    try {
      const readNotifs = await getReadNotifications();
      if (!readNotifs.includes(notificationId)) {
        readNotifs.push(notificationId);
        await AsyncStorage.setItem('read_notifications', JSON.stringify(readNotifs));
      }
    } catch (error) {
      console.error('Error saving read notification:', error);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(
        `http://192.168.46.163/phpProjects/donationApp_restapi/api/User/itemdonation.php?user_id=${userId}`
      );
      
      if (response.data.status === 'success') {
        // Sort by date (newest first)
        const sortedNotifications = response.data.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        // Get previously read notifications
        const readNotifs = await getReadNotifications();

        // Transform the data to match notification format and filter out pending status
        const transformedNotifications = sortedNotifications
          .filter(item => item.status.toLowerCase() !== 'pending')
          .map(item => ({
            id: item.item_id.toString(),
            product: item.item_name,
            ngo: item.ngoname || "Unknown NGO",
            status: item.status.toLowerCase(),
            date: formatDate(item.created_at),
            read: readNotifs.includes(item.item_id.toString()), // Check if notification was previously read
          }));

        setNotifications(transformedNotifications);
      } else {
        console.error('Error fetching notifications:', response.data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date to a more readable format (e.g., "2 hours ago", "1 day ago")
  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffHrs < 24) {
      return diffHrs === 1 ? '1 hour ago' : `${diffHrs} hours ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else {
      return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
    }
  };

  const markAsRead = async (notificationId) => {
    // Save to AsyncStorage first
    await saveReadNotification(notificationId);
    
    // Then update state
    setNotifications(
      notifications.map(item => 
        item.id === notificationId ? { ...item, read: true } : item
      )
    );
  };

  const renderNotificationItem = ({ item }) => {
    // Determine status icon and color
    let statusIcon, statusColor, backgroundColor;   
    
    if (item.status === 'accepted') {
      statusIcon = 'check-circle';
      statusColor = '#4CAF50';
      backgroundColor = item.read ? '#fff' : '#f0f8ff';
    } else if (item.status === 'completed') {
      statusIcon = 'verified';
      statusColor = '#2196F3';
      backgroundColor = item.read ? '#fff' : '#f0f8ff';
    }

    return (
      <TouchableOpacity 
        style={[styles.notificationItem, { backgroundColor }]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationContent}>
          <Text style={styles.productName}>{item.product}</Text>
          <View style={styles.ngoContainer}>
            <MaterialIcons name="location-city" size={16} color="#666" />
            <Text style={styles.ngoName}>{item.ngo}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <MaterialIcons name={statusIcon} size={18} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        
        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  const handleBackPress = () => {
    router.back();
  };

  const unreadCount = notifications.filter(item => !item.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>
      
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <MaterialIcons name="notifications-active" size={20} color="#fff" />
          <Text style={styles.unreadText}>You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="notifications-off" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      )}
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 80, // Added for Navbar spacing
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  unreadText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 10,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 70, // Added for Footer spacing
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  ngoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ngoName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 8,
    fontStyle: 'italic',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4a90e2',
    alignSelf: 'center',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
});

export default Notification;