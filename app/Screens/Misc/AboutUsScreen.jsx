import React from "react";
import { View, ScrollView, StyleSheet, StatusBar } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "expo-router";

const AboutUsScreen = () => {
  const router = useRouter();
  return (
    <View>
      <Navbar />
    <ScrollView style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.title}>About Dayabhav</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.description}>
            <Text style={styles.boldText}>Dayabhav</Text> is a platform dedicated to helping individuals donate
              clothes and unused items to NGOs in need. Our goal is to bridge
              the gap between donors and organizations, making it easy to
              contribute and make a difference in society.
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.subtitle}>About the Developer</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.description}>
              <Text style={styles.boldText}>Hi, I'm Devang Thaker,</Text> the
              creator of <Text style={styles.boldText}>Dayabhav.</Text>I am
              currently pursuing{" "}
              <Text style={styles.highlightText}>
                Information and Communication Technology
              </Text>{" "}
              at <Text style={styles.highlightText}>Adani University</Text>.
              With a passion for leveraging technology to solve real-world
              challenges, I envisioned{" "}
              <Text style={styles.boldText}>Dayabhav</Text> as a platform to
              bridge the gap between donors and those in need. My goal is to
              make donations more accessible, ensuring that unused items reach
              the people who need them the most.
            </Text>
          </Card.Content>
        </Card>

        <Button mode="contained" style={styles.button} onPress={() => {router.push('/Screens/Misc/ContactUsScreen')}}>
          Contact Us
        </Button>
      </View>


      {/* <Footer /> */}
    </ScrollView>
    </View>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 120,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#555",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#4682B4"
  },
  boldText: {
    fontWeight: "bold",
    color: "#007AFF", 
  },
  highlightText: {
    fontWeight: "bold",
    color: "#333", 
  },
});
