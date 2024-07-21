import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {CreateWorkoutContext} from './../../context/CreateWorkoutContext'
export default function SearchPlace() {

    const navigation=useNavigation();
    const {workoutData,setWorkoutData}=useContext(CreateWorkoutContext)
    const router=useRouter();

    useEffect(()=>{
        navigation.setOptions({
            headerShown:true,
            headerTransparent:true,
            headerTitle:'Search'
        })
    },[])

    useEffect(()=>{
        console.log(workoutData);
        
    }),[workoutData]


  return (
    <View style={{
        padding:25,
        paddingTop:75,
        backgroundColor:Colors.WHITE,
        height:'100%'
    }}>
        
      
      <GooglePlacesAutocomplete
      placeholder='Search Place'
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
        setWorkoutData({
            locationInfo:{
                name:data.description,
                coordinates:details?.geometry.location,
                photoRef:details?.photos[0]?.photo_reference,
                url:details?.url
            }
        });

        router.push('/create-workout/createworkout')
      }}

      

      query={{
        key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
        language: 'en',
      }}
      styles={{
        textInputContainer:{
            borderWidth:3,
            borderRadius:5,
            marginTop:40
        }
      }}
    />
    </View>
  )
}