import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const Notification = ({ navigation }) => {
    const router = useRouter();
  // Static notification data for demo
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      product: 'Winter Clothes Collection',
      ngo: 'Helping Hands Foundation',
      status: 'accepted',
      date: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      product: 'Food Packages (10 units)',
      ngo: 'Food For All',
      status: 'completed',
      date: '1 day ago',
      read: false,
    },
    {
      id: '3',
      product: 'School Supplies Kit',
      ngo: 'Education First NGO',
      status: 'accepted',
      date: '2 days ago',
      read: false,
    },
    {
      id: '4',
      product: 'Medical Supplies',
      ngo: 'Health Care Initiative',
      status: 'completed',
      date: '1 week ago',
      read: false,
    },
    {
      id: '5',
      product: 'Toys Donation',
      ngo: 'Children Happiness',
      status: 'accepted',
      date: '1 week ago',
      read: false,
    },
  ]);

  const markAsRead = (notificationId) => {
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
});

export default Notification;