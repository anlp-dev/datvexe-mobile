import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
          <Toast/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
