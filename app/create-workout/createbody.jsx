import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SelectBodyList } from '../../constants/Options';
import OptionCard from '../../components/CreateWorkout/OptionCard';
import { CreateWorkoutContext } from '../../context/CreateWorkoutContext';

export default function CreateBody() {
  const navigation = useNavigation();
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const { workoutData, setWorkoutData } = useContext(CreateWorkoutContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '',
    });
  }, []);

  useEffect(() => {
    setWorkoutData({ ...workoutData, bodyPart: selectedBodyPart });
  }, [selectedBodyPart]);

  useEffect(() => {
    console.log(workoutData);
  }, [workoutData]);

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
        Select Body Part
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'outfit-medium',
          marginTop: 20,
        }}
      >
        Where you want to train
      </Text>

      <FlatList
        data={SelectBodyList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedBodyPart(item)}
            style={{
              marginVertical: 10,
            }}
          >
            <OptionCard option={item} selectedOption={selectedBodyPart} />
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
          router.push('/create-workout/createlevel'); // Adjust the route as needed
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
