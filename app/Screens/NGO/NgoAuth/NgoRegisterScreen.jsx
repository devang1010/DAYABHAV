import React, { useEffect, useState } from "react";
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

const NGOSignupScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  const router = useRouter();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const hasEmailError = email.length > 0 && !validateEmail(email);
  const hasPasswordError = password.length > 0 && password.length < 6;
  const passwordsMatch = password === confirmPassword;
  const hasContactError = contact.length > 0 && !/^\d{10}$/.test(contact);

  const handleSignup = () => {
    if (
      !name ||
      !description ||
      !email ||
      !address ||
      !contact ||
      !website ||
      !password ||
      !confirmPassword
    ) {
      alert("All fields are required!");
      return;
    }
    if (hasEmailError || hasPasswordError || hasContactError || !passwordsMatch) {
      alert("Please fix errors before submitting.");
      return;
    }

    setLoading(true);
    setSubmit(true);
  };

  useEffect(() => {
    if(!submit) return;

    const registerNgo = async () => {
      try {
        const response = await axios.post(
          "http://192.168.4.126/phpProjects/donationApp_restapi/api/Ngo/register.php",
          {
            ngoname: name,
            description,
            email,
            address,
            phonenumber: contact,
            website,
            password: password
          },
          {
            headers: {
              "Content-Type": "application/json"
            },
          }
        );

        if(response.data.success){
          Alert.alert("Success", "Registration successfully!");
          router.push("/Screens/Auth/LoginScreen");
        } else {
          Alert.alert("Error", response.data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error", error);
        Alert.alert("Error", "Something went wrong. Please try again");
      } finally {
        setLoading(false);
        setSubmit(false);
      }
    }

    registerNgo();
  }, [submit]);

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
            <Title style={styles.title}>NGO Registration</Title>

            <TextInput
              label="NGO Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="domain" color="#4682B4" />}
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="text-box" color="#4682B4" />}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="email" color="#4682B4" />}
            />
            <HelperText type="error" visible={hasEmailError}>
              Enter a valid email.
            </HelperText>

            <TextInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              mode="outlined"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="map-marker" color="#4682B4" />}
            />

            <TextInput
              label="Contact Information"
              value={contact}
              onChangeText={setContact}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="phone" color="#4682B4" />}
            />
            <HelperText type="error" visible={hasContactError}>
              Enter a valid 10-digit phone number.
            </HelperText>

            <TextInput
              label="Website"
              value={website}
              onChangeText={setWebsite}
              mode="outlined"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#4682B4"
              left={<TextInput.Icon icon="web" color="#4682B4" />}
            />

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
            <HelperText
              type="error"
              visible={!passwordsMatch && confirmPassword.length > 0}
            >
              Passwords do not match.
            </HelperText>

            {loading ? (
              <ActivityIndicator animating={true} size="large" color="#4682B4" />
            ) : (
              <Button 
                mode="contained" 
                onPress={handleSignup} 
                style={styles.button}
                color="#4682B4"
              >
                Register NGO
              </Button>
            )}
            
            <Text style={styles.signupText}>
              Already have an account?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => router.push("/Screens/Auth/LoginScreen")}
              >
                Login here
              </Text>
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
    marginBottom: 24,
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
  signupText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    color: "#4682B4",
    fontWeight: "bold",
  },
});

export default NGOSignupScreen;