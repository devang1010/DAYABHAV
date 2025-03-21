import { StyleSheet, Text, View, FlatList, } from 'react-native'
import { TouchableOpacity } from 'react-native';
import {React, useState} from 'react'

const jobTypes = ["Laptops", "Mobiles", "Books", "Clothing", "Furniture", "Toys", "Others"];

const itemTabs = () => {
    const [activeJobType, setActiveJobType] = useState('Full-time');
  return (
    
    <View style={styles.tabsContainer}>
        <FlatList
          data={jobTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(activeJobType, item)}
              onPress={() => {
                setActiveJobType(item);
                router.push(`/search/${item}`);
              }}
            >
              <Text style={styles.tabText(activeJobType, item)}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: 20 }}
          horizontal
        />
      </View>
  )
}

export default itemTabs

const styles = StyleSheet.create({
    tabsContainer: {
        width: "100%",
        marginTop: 20,
      },
      tab: (activeJobType, item) => ({
        paddingVertical:  10,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: activeJobType == item ? "purple" : "white", 
        borderColor: activeJobType === item ? "purple" : "purple",
      }),
      tabText: (activeJobType, item) => ({
        color: activeJobType === item ? "white" : "purple",
      }),
})