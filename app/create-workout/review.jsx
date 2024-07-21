import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { Colors } from '../../constants/Colors';
import { CreateWorkoutContext } from '../../context/CreateWorkoutContext';

export default function Review() {

  const navigation = useNavigation();
  const {workoutData, setWorkoutData}=useContext(CreateWorkoutContext);

  const router=useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Ensure that the default header is not shown
    });
  }, []);

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: '100%',
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color="black" />
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: 'outfit-bold',
          fontSize: 35,
          marginTop: 20,
        }}
      >
        Review Workout Plan
      </Text>

      <View style={{
        marginTop:20
      }}>
        <Text style={{
            fontFamily:'outfit-medium',
            fontSize:20
        }}>Before generating your plan, please review your selection</Text>
        
        <View style={{
            marginTop:40,
            display:'flex',
            flexDirection:'row',
            gap:20
        }}>
        {/*<Ionicons name="pin" size={30} color="black" />*/}
        <Text style={{
            fontSize:50
        }}>📍</Text>
        <View>
            <Text style={{
                fontFamily:'outfit',
                fontSize:20,
                color:Colors.GRAY
            }}>Location</Text>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:25
                
            }}>{workoutData?.locationInfo?.name}</Text>
        </View>
        </View>

        <View style={{
            marginTop:35,
            display:'flex',
            flexDirection:'row',
            gap:20
        }}>
        {/*<Ionicons name="pin" size={30} color="black" />*/}
        <Text style={{
            fontSize:50
        }}>🎯</Text>
        <View>
            <Text style={{
                fontFamily:'outfit',
                fontSize:20,
                color:Colors.GRAY
            }}>Goal</Text>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:25
                
            }}>{workoutData?.title?.title}</Text>
        </View>
        </View>

        <View style={{
            marginTop:35,
            display:'flex',
            flexDirection:'row',
            gap:20
        }}>
        {/*<Ionicons name="pin" size={30} color="black" />*/}
        <Text style={{
            fontSize:50
        }}>💪</Text>
        <View>
            <Text style={{
                fontFamily:'outfit',
                fontSize:20,
                color:Colors.GRAY
            }}>Body Part</Text>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:25
                
            }}>{workoutData?.bodyPart?.title}</Text>
        </View>
        </View>

        <View style={{
            marginTop:35,
            display:'flex',
            flexDirection:'row',
            gap:20
        }}>
        {/*<Ionicons name="pin" size={30} color="black" />*/}
        <Text style={{
            fontSize:50
        }}>#️⃣</Text>
        <View>
            <Text style={{
                fontFamily:'outfit',
                fontSize:20,
                color:Colors.GRAY
            }}>Level</Text>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:25
                
            }}>{workoutData?.level?.title}</Text>
        </View>
        </View>


      </View>
      <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 80,
        }}
        onPress={() => {
          router.replace('/create-workout/generateworkout'); // Adjust the route as needed
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: Colors.WHITE,
            fontSize: 18,
            fontFamily: 'outfit-medium',
          }}
        >
          Build My Plan
        </Text>
      </TouchableOpacity>
      
    </View>
  );
}
