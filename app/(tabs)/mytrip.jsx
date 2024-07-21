import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import StartNewWorkout from '../../components/MyWorkout/StartNewWorkout';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfig';
import UserWorkoutList from '../../components/MyWorkout/UserWorkoutList';
import { router } from 'expo-router';

export default function mytrip() {
  const [userWorkout, setUserWorkout] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      GetMyWorkouts();
    }
  }, [user]);

  const GetMyWorkouts = async () => {
    setLoading(true);
    setUserWorkout([]);
    
    try {
      const q = query(collection(db, 'UserWorkout'), where('userEmail', '==', user?.email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('No workouts found');
      } else {
        const workouts = querySnapshot.docs.map(doc => doc.data());
        console.log('Fetched Workouts:', workouts);
        setUserWorkout(workouts);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={{
      padding: 25,
      paddingTop: 55,
      backgroundColor: Colors.WHITE,
      height: '100%'
    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 35
        }}>My Workout</Text>
        <Ionicons name="add-circle" size={50} color="black" onPress={() => router.push('/create-workout/search-place')} />
      </View>

      {loading && <ActivityIndicator size={'large'} color={Colors.PRIMARY} />}

      {userWorkout.length === 0 ?
        <StartNewWorkout />
        :
        <UserWorkoutList userWorkout={userWorkout} />
      }
    </View>
  );
}
