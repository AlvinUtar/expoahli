import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { SelectLevelList } from '../../constants/Options';
import OptionCard from '../../components/CreateWorkout/OptionCard';
import { CreateWorkoutContext } from '../../context/CreateWorkoutContext';
import { Ionicons } from '@expo/vector-icons';

export default function CreateLevel() {
  const navigation = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { workoutData, setWorkoutData } = useContext(CreateWorkoutContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '',
    });
  }, []);

  useEffect(() => {
    console.log(workoutData);
  }, [workoutData]);

  useEffect(() => {
    if (selectedLevel) {
      setWorkoutData({ ...workoutData, level: selectedLevel });
    }
  }, [selectedLevel]);

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
        Select Training Level
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'outfit-medium',
          marginTop: 20,
        }}
      >
        Choose your workout intensity
      </Text>

      <FlatList
        data={SelectLevelList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedLevel(item)}
            style={{
              marginVertical: 10,
            }}
          >
            <OptionCard option={item} selectedOption={selectedLevel} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity
        style={{
          padding: 20,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 20,
        }}
        onPress={() => {
          router.push('/create-workout/review'); // Adjust the route as needed
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
