import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import Login from './../components/Login'
import {auth} from './../configs/FirebaseConfig'
import { Redirect } from "expo-router";

export default function Index() {
  useFonts({
    'outfit':require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium':require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold':require('./../assets/fonts/Outfit-Bold.ttf'),
  })

  const user=auth.currentUser;
  return (
    <View
      style={{
        flex: 1,
        
      }}
    >
      {user?
      <Redirect href={'/mytrip'}/>:<Login/>}
    </View>
  );
}
