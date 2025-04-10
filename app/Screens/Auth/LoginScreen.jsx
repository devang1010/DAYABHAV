import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  ActivityIndicator,
  Title,
} from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import { StatusBar } from "expo-status-bar";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const hasEmailError = email.length > 0 && !validateEmail(email);
  const hasPasswordError = password.length > 0 && password.length < 6;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if (hasEmailError || hasPasswordError) {
      Alert.alert("Error", "Please fix errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.46.163/phpProjects/donationApp_restapi/api/login.php",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);

      if (response.data.success) {
        Alert.alert("Success", "Login successful!");

        // Store user_id in AsyncStorage
        await AsyncStorage.setItem("user_id", String(response.data.user_id));
        await AsyncStorage.setItem("role_id", String(response.data.role_id));
        await AsyncStorage.setItem("username", String(response.data.username));

        // Store Ngo data
        await AsyncStorage.setItem("ngo_id", String(response.data.ngo_id));
        await AsyncStorage.setItem("ngoname", String(response.data.ngoname));
        await AsyncStorage.setItem("email", String(response.data.email));

        if (response.data.role_id === 2) {
          if (response.data.blocked === 0) {
            router.push("/Screens/User/Home/HomeScreen");
          } else {
            Alert.alert(
              "Error",
              "Your account is blocked. Please contact support to unblock your account."
            );
            router.push("/Screens/Misc/ContactUsScreen");
          }
        } else if (response.data.role_id === 3) {
          router.push("/Screens/NGO/Home/NgoHomeScreen");
        } else if (response.data.role_id === 1) {
          router.push("/Screens/ADMIN/Dashboard");
        } 
        else {
          Alert.alert("Error", "Invalid Role ID, contact the developer");
        }
      } else {
        Alert.alert("Error", response.data.message || "Login failed!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Title style={styles.mainTitle}>DAYABHAV</Title>
            <Text style={styles.subtitle}>Connect. Contribute. Change.</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Title style={styles.title}>Login</Title>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="email" color="#4682B4" />}
            />
            <HelperText type="error" visible={hasEmailError}>
              Enter a valid email.
            </HelperText>

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="lock" color="#4682B4" />}
            />
            <HelperText type="error" visible={hasPasswordError}>
              Password must be at least 6 characters.
            </HelperText>

            {loading ? (
              <ActivityIndicator animating={true} size="large" color="#4682B4" />
            ) : (
              <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                color="#4682B4"
              >
                Login
              </Button>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.signupText}>Don't have an account?</Text>

            <View style={styles.registrationContainer}>
              <Text style={styles.signupText}>
                Register as User?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => router.push("/Screens/Auth/RegisterScreen")}
                >
                  Register here
                </Text>
              </Text>

              <Text style={styles.signupText}>
                Register as NGO?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() =>
                    router.push("/Screens/NGO/NgoAuth/NgoRegisterScreen")
                  }
                >
                  Register here
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 48,
    marginTop: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4682B4",
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  input: {
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: "#4682B4",
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#888",
    fontWeight: "500",
  },
  signupText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    color: "#4682B4",
    fontWeight: "bold",
  },
  registrationContainer: {
    marginTop: 8,
  },
});

export default LoginScreen;