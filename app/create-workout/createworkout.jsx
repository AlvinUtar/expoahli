import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SelectGoalList } from '../../constants/Options';
import OptionCard from '../../components/CreateWorkout/OptionCard';
import { CreateWorkoutContext } from '../../context/CreateWorkoutContext';

export default function CreateWorkout() {
  const navigation = useNavigation();
  const [selectedGoal, setSelectedGoal] = useState();
  const { workoutData, setWorkoutData } = useContext(CreateWorkoutContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);
  
  useEffect(() => {
    setWorkoutData(prevData => ({ ...prevData, title: selectedGoal }));
  }, [selectedGoal]);
  
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: '100%',
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="black" />
      </TouchableOpacity>
  
      <Text
        style={{
          fontSize: 40,
          fontFamily: 'outfit-bold',
          marginTop: 20,
        }}
      >
        Select Your Goal
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'outfit-medium',
          marginTop: 20,
        }}
      >
        What you want to achieve
      </Text>
  
      <FlatList
        data={SelectGoalList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedGoal(item)}
            style={{
              marginVertical: 10,
            }}
          >
            <OptionCard option={item} selectedOption={selectedGoal} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        onPress={() => router.push('/create-workout/createbody')}
        style={{
          padding: 20,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
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
          CONTINUE
        </Text>
      </TouchableOpacity>
    </View>
  );
  
}
