import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { CreateWorkoutContext } from '../../context/CreateWorkoutContext';
import { AI_PROMPT } from '../../constants/Options';
import { chatSession } from '../../configs/AiModal';
import { useRouter } from 'expo-router';
import { auth, db } from './../../configs/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function GenerateWorkout() {
  const { workoutData } = useContext(CreateWorkoutContext);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://fallback-image-url.com/image.jpg'); // Default fallback image URL
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (workoutData) {
      generateAiWorkout();
      // Set map image URL if location info is available
      if (workoutData.locationInfo && workoutData.locationInfo.coordinates) {
        const { lat, lng } = workoutData.locationInfo.coordinates;
        setImageUrl(getStaticMapUrl({ lat, lng }));
      }
    }
  }, [workoutData]);

  const getStaticMapUrl = (coordinates) => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=14&size=600x300&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`;
  };

  const generateAiWorkout = async () => {
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', workoutData?.locationInfo?.name || '')
      .replace('{goal}', workoutData?.title?.desc || '')
      .replace('{bodyPart}', workoutData?.bodyPart?.title || '')
      .replace('{level}', workoutData?.level?.title || '');

    console.log('Generated Prompt:', FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log('AI Response:', result.response.text());

      let workoutData = {};
      try {
        workoutData = JSON.parse(result.response.text());
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return;
      }

      const docId = (Date.now()).toString();
      await setDoc(doc(db, 'UserWorkout', docId), {
        docId,
        userEmail: user.email,
        workoutData,
      });

      router.push('(tabs)/mytrip');
    } catch (error) {
      console.error('Error generating workout or saving to Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Generating your workout plan...</Text>
        </>
      ) : (
        <>
          <Text style={styles.waitText}>Please wait...</Text>
          <Text style={styles.processingText}>We are working to generate your workout plan</Text>
          <Image
            source={require('./../../assets/images/wait.gif')}
            style={styles.waitImage}
          />
          <Text style={styles.doNotGoBackText}>Do Not Go Back</Text>
          <Image
            source={{ uri: imageUrl }}
            style={styles.staticMapImage}
            onError={(e) => {
              console.log('Image fetch error:', e.nativeEvent.error);
              setImageUrl('https://fallback-image-url.com/image.jpg'); // Use fallback URL if there's an error
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 75,
    backgroundColor: Colors.WHITE,
    height: '100%',
  },
  loadingText: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  waitText: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
    textAlign: 'center',
  },
  processingText: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  waitImage: {
    width: '100%',
    height: 250,
    marginTop: 40,
    borderRadius: 25,
  },
  doNotGoBackText: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  staticMapImage: {
    width: '100%',
    height: 240,
    borderRadius: 15,
    marginTop: 20,
  },
});
