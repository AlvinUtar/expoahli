import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { router, useRouter } from 'expo-router';

export default function Login() {

    const route = useRouter();

  return (
    <View>
      <Image source={require('./../assets/images/login.png')}
      style={{
        width:'100%',
        height:580
      }}/>
      <View style={styles.container}>
        <Text style={{
            fontSize:30,
            fontFamily:'outfit-bold',
            textAlign:'center'
        }}>AHLI</Text>
    </View>

    <TouchableOpacity style={styles.button}
    onPress={()=>router.push('auth/sign-in')}>
        <Text style={{color:Colors.WHITE,
            textAlign:'center',
            fontFamily:'outfit',
            fontSize:17
        }}>
            Sign in with Google
        </Text>
    </TouchableOpacity>
    </View>
    
    
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.WHITE,
        marginTop:-20,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        height:'100%,',
        padding:25
    },

    button:{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:99,
        marginTop:'25%',
        marginHorizontal: 20

    }

})