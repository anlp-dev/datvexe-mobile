import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkToken = async () => {
    try{
        const token = await AsyncStorage.getItem("token");

        if(!token){
            return null;
        }
        return token;
    }catch (e) {
        throw new Error(e);
    }
}