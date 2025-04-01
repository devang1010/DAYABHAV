import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const BottomTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: "About Us",
      icon: "info",
      color: "#2E86C1",
      route: '/Screens/Misc/AboutUsScreen'
    },
    {
      name: "Contact Us",
      icon: "phone",
      color: "#28B463",
      route: '/Screens/Misc/ContactUsScreen'
    },
    {
      name: "Feedback",
      icon: "feedback",
      color: "#F39C12",
      route: '/Screens/Misc/FeedbackScreen'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            pathname === tab.route && styles.activeTab
          ]}
          onPress={() => router.push(tab.route)}
        >
          <MaterialIcons 
            name={tab.icon}
            size={24}
            color={pathname === tab.route ? "#FFFFFF" : tab.color}
          />
          <Text
            style={[
              styles.tabText,
              pathname === tab.route && styles.activeTabText
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 999, // Ensure it stays above other content
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#2C3E50',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});