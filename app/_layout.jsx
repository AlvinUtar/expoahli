import { Stack } from "expo-router";
import {CreateWorkoutContext} from '../context/CreateWorkoutContext'
import { useState } from "react";
export default function RootLayout() {


  const [workoutData,setWorkoutData]=useState([]);
  return (
    <CreateWorkoutContext.Provider value={{workoutData, setWorkoutData}}>
    <Stack screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name="(tabs)"options={{
        headerShown:false
      }} />
    </Stack>
    </CreateWorkoutContext.Provider>
  );
}
