import React, {useEffect} from "react";
import {TouchableOpacity} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome5} from "@expo/vector-icons";

// Screens
import NavigationTab from "./NavigationTab";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Stack = createStackNavigator();

// Constants
const HEADER_STYLE = {
    backgroundColor: "#FFA07A",
};

const HEADER_TINT_COLOR = "#fff";

// Common header options
const getCommonHeaderOptions = (title) => ({
    headerBackTitle: title === "Hoàn thành" ? null : " Quay lại",
    headerBackImage: () => (
        <FontAwesome5 name="chevron-left" size={16} color={HEADER_TINT_COLOR}/>
    ),
    headerStyle: HEADER_STYLE,
    headerTintColor: HEADER_TINT_COLOR,
    headerTitle: title,
});

// Screen configurations
const SCREEN_CONFIGS = [
    {
        name: "MainTabs",
        component: NavigationTab,
        options: {headerShown: false},
    },

];

const AppNavigator = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const loadToken = async () => {
            try{
                const token = await AsyncStorage.getItem("token");
                if(!token){
                    navigation.replace("Login");
                }
            }catch (e) {
                console.log(e)
            }
        }
        loadToken();
    }, []);


    return (
        <Stack.Navigator initialRouteName="MainTabs">
            {SCREEN_CONFIGS.map(({name, component, options}) => (
                <Stack.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={options}
                />
            ))}
        </Stack.Navigator>
    );
};

export default AppNavigator;