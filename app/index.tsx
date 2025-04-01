import { Text, View } from "react-native";
import { Redirect } from "expo-router";

// User Screens
import Register from "@/app/Screens/Auth/RegisterScreen"
import Login from "@/app/Screens/Auth/LoginScreen"
import Home from "@/app/Screens/User/Home/HomeScreen"
import AboutUs from "@/app/Screens/Misc/AboutUsScreen"
import ContactUs from "@/app/Screens/Misc/ContactUsScreen"
import Feedback from "@/app/Screens/Misc/FeedbackScreen"
import NgoListScreen from "@/app/Screens/User/Ngo/NGOListScreen"
import DonateItemScreen from "@/app/ScreenS/User/Donation/DonateItemScreen"
import UserProfile from "@/app/Screens/User/Profile/Profile"

// Ngo Screens
import NgoRegister from "@/app/Screens/NGO/NgoAuth/NgoRegisterScreen"
import NgoHomeScreen from "@/app/Screens/NGO/Home/NgoHomeScreen"
import UrgentNeedsManagementForm from "@/app/Screens/NGO/NeedsManagement/UrgentNeedsManagementForm";
import InventoryManagementScreen from "@/app/Screens/NGO/Inventory/InventoryManagementScreen"
import AllDonationsScreen from "@/app/Screens/NGO/Donations/AllDonationsScreen"
import DonationDetailScreen from "@/app/Screens/NGO/Donations/DonationDetailScreen"
import NgoProfile from "@/app/Screens/NGO/Profile/NgoProfile"

// Admin Screens
import Dashboard from "@/app/Screens/ADMIN/Dashboard"
export default function Index() {
  return (

    // <Dashboard />

    // <View>
      // <Register /> 
      <Login /> 
    //  <Home /> 
      // <DonateItemScreen /> 
    //   <NgoListScreen /> 
    //   <AboutUs /> 
    //   <ContactUs /> 
    //   <Feedback /> 
      // <UserProfile />
    // </View>
    // <Redirect href={"/Screens/Auth/LoginScreen"} />

    // <NgoRegister />
    // <NgoHomeScreen />
    // <UrgentNeedsManagementForm />
    // <InventoryManagementScreen />
    // <AllDonationsScreen />
    // <DonationDetailScreen />
    // <NgoProfile />
    // <Redirect href={'/Screens/NGO/NgoAuth/NgoLoginScreen'} />
  );
}
