import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
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

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const hasEmailError = email.length > 0 && !validateEmail(email);
  const hasPasswordError = newPassword.length > 0 && newPassword.length < 6;
  const hasConfirmPasswordError = 
    confirmPassword.length > 0 && confirmPassword !== newPassword;

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    
    if (hasEmailError || hasPasswordError || hasConfirmPasswordError) {
      Alert.alert("Error", "Please fix errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.46.163/phpProjects/donationApp_restapi/api/resetpassword.php",
        { email, new_password: newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);

      if (response.data.success) {
        Alert.alert(
          "Success", 
          "Password has been reset successfully!",
          [{ text: "OK", onPress: () => router.push("/Screens/Auth/LoginScreen") }]
        );
      } else {
        Alert.alert("Error", response.data.message );
      }
    } catch (error) {
      setLoading(false);
      console.error("Password Reset Error:", error);
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
            <Title style={styles.title}>Reset Password</Title>
            
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
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
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

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="lock-check" color="#4682B4" />}
            />
            <HelperText type="error" visible={hasConfirmPasswordError}>
              Passwords do not match.
            </HelperText>

            {loading ? (
              <ActivityIndicator animating={true} size="large" color="#4682B4" />
            ) : (
              <Button 
                mode="contained" 
                onPress={handleResetPassword} 
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                color="#4682B4"
              >
                Reset Password
              </Button>
            )}

            <Text 
              style={styles.backToLoginLink}
              onPress={() => router.push("/Screens/Auth/LoginScreen")}
            >
              Back to Login
            </Text>
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
  backToLoginLink: {
    textAlign: "center",
    marginTop: 24,
    color: "#4682B4",
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;