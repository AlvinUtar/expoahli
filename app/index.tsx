import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import Login from './../components/Login'
export default function Index() {
  useFonts({
    'outfit':require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium':require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold':require('./../assets/fonts/Outfit-Bold.ttf'),
  })
  return (
    <View
      style={{
        flex: 1,
        
      }}
    >
      <Login>

      </Login>
    </View>
  );
}
