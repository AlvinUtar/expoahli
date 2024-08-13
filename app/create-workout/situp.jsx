import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  Modal,
  TextInput,
  Platform,
  Share,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

const Situp = () => {
  const [situpCount, setSitupCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [startTime, setStartTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [customThreshold, setCustomThreshold] = useState(0.5);
  const [customSensitivity, setCustomSensitivity] = useState(100);
  const [goal, setGoal] = useState(0);
  const [currentGoal, setCurrentGoal] = useState(0);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const lastSitupTime = useRef(0);
  const situpState = useRef('waiting');

  useEffect(() => {
    if (isTracking) {
      _subscribe();
      setStartTime(Date.now());
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => {
        _unsubscribe();
        clearInterval(interval);
      };
    } else {
      _unsubscribe();
    }
  }, [isTracking]);

  useEffect(() => {
    if (situpCount > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [situpCount]);

  useEffect(() => {
    if (currentGoal >= goal && goal > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Alert.alert('Congratulations!', `You have reached your goal of ${goal} sit-ups!`);
    }
  }, [currentGoal, goal]);

  const detectSitup = ({ x, y, z }) => {
    const now = Date.now();
    const acceleration = Math.sqrt(x * x + y * y + z * z);

    switch (situpState.current) {
      case 'waiting':
        if (z < -customThreshold) {
          situpState.current = 'going_down';
        }
        break;
      case 'going_down':
        if (z > customThreshold) {
          situpState.current = 'going_up';
        }
        break;
      case 'going_up':
        if (Math.abs(z) < 0.2 && now - lastSitupTime.current > customSensitivity) {
          setSitupCount(prevCount => prevCount + 1);
          setCurrentGoal(prevGoal => Math.max(prevGoal, situpCount + 1));
          lastSitupTime.current = now;
          situpState.current = 'waiting';
        }
        break;
    }
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        detectSitup(accelerometerData);
      })
    );
    Accelerometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const toggleTracking = () => {
    if (isTracking) {
      _unsubscribe();
      setIsTracking(false);
      setExerciseHistory([...exerciseHistory, { date: new Date(), situps: situpCount, duration: timer }]);
      Alert.alert('Tracking Stopped', `You did ${situpCount} sit-ups in ${timer} seconds!`);
    } else {
      _subscribe();
      setIsTracking(true);
      setStartTime(Date.now());
      setSitupCount(0);
      setTimer(0);
      situpState.current = 'waiting';
      lastSitupTime.current = 0;
    }
  };

  const handleShareResults = async () => {
    try {
      await Share.share({
        message: `I just did ${situpCount} sit-ups in ${timer} seconds! #SitupChallenge`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  // Button styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: 'outfit-bold',
      fontWeight: 'bold',
      marginBottom: 20,
    },
    situpCount: {
      fontSize: 100,
      fontFamily: 'outfit-bold',
      color: '#007bff',
      marginBottom: 20,
    },
    timer: {
      fontSize: 24,
      fontFamily: 'outfit-medium',
      color: '#6c757d',
      marginBottom: 20,
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 20, // Ensure corners are rounded
      marginVertical: 10, // Add vertical margin
      marginHorizontal: 10, // Add horizontal margin
      width: '100%', // Make sure the button takes the full width
    },
    startButton: {
      borderRadius: 20, // Ensure borderRadius is applied
    },
    stopButton: {
      borderRadius: 20, // Ensure borderRadius is applied
    },
    settingsButton: {
      borderRadius: 20, // Ensure borderRadius is applied
    },
    tipsButton: {
      borderRadius: 20, // Ensure borderRadius is applied
    },
    historyButton: {
      borderRadius: 20, // Ensure borderRadius is applied
    },
    shareButton: {
      borderRadius: 20, // Ensure borderRadius is applied
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'outfit-bold',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'outfit-bold',
      marginBottom: 10,
    },
    modalText: {
      fontSize: 16,
      fontFamily: 'outfit-regular',
      marginBottom: 20,
    },
    slider: {
      width: '100%',
      height: 40,
      marginBottom: 20,
    },
    textInput: {
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    historyEntry: {
      marginBottom: 15,
    },
    image: {
      width: 200, // Adjust the width as needed
      height: 200, // Adjust the height as needed
      marginBottom: 20,// Add margin if needed
      backgroundColor: '#ffffff', 
    },
  });

  const GradientButton = ({ colors, style, onPress, children }) => (
    <TouchableOpacity onPress={onPress} style={style}>
      <LinearGradient
        colors={colors}
        style={[styles.button, style]}
        start={[0, 0]}
        end={[1, 1]}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sit-up Tracker</Text>
      <Animated.Text style={[styles.situpCount, { opacity: fadeAnim }]}>
        {situpCount}
      </Animated.Text>
      <Text style={styles.timer}>Time: {timer} sec</Text>
      <Image source={require('./../../assets/images/situp.gif')} style={styles.image} // Apply the style here
  resizeMode="contain"></Image>
      {isTracking ? (
        <GradientButton
          colors={['#dc3545', '#a71d2a']}
          style={styles.stopButton}
          onPress={toggleTracking}
        >
          Stop Tracking
        </GradientButton>
      ) : (
        <GradientButton
          colors={['#28a745', '#1e7e34']}
          style={styles.startButton}
          onPress={toggleTracking}
        >
          Start Tracking
        </GradientButton>
      )}
      <GradientButton
        colors={['#007bff', '#0056b3']}
        style={styles.settingsButton}
        onPress={() => setModalVisible(true)}
      >
        Settings
      </GradientButton>
      <GradientButton
        colors={['#17a2b8', '#117a8b']}
        style={styles.tipsButton}
        onPress={() => setShowTips(true)}
      >
        Exercise Tips
      </GradientButton>
      <GradientButton
        colors={['#ffc107', '#e0a800']}
        style={styles.historyButton}
        onPress={() => setShowHistory(true)}
      >
        View History
      </GradientButton>
      <GradientButton
        colors={['#17a2b8', '#117a8b']}
        style={styles.shareButton}
        onPress={handleShareResults}
      >
        Share Results
      </GradientButton>

      {/* Modals for Settings, Exercise Tips, and History */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            <Text style={styles.modalText}>Adjust the sit-up detection settings:</Text>
            <Text style={styles.modalText}>Threshold: {customThreshold.toFixed(2)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1.0}
              value={customThreshold}
              onValueChange={setCustomThreshold}
            />
            <Text style={styles.modalText}>Sensitivity: {customSensitivity}</Text>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={200}
              value={customSensitivity}
              onValueChange={setCustomSensitivity}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your goal"
              keyboardType="numeric"
              value={goal.toString()}
              onChangeText={text => setGoal(parseInt(text))}
            />
            <GradientButton
              colors={['#007bff', '#0056b3']}
              style={styles.settingsButton}
              onPress={() => setModalVisible(false)}
            >
              Save
            </GradientButton>
          </View>
        </View>
      </Modal>

      <Modal visible={showTips} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Exercise Tips</Text>
            <Text style={styles.modalText}>
              Here are some tips to improve your sit-ups:
              1. Keep your feet flat on the ground.
              2. Use your core muscles to lift your torso.
              3. Keep your hands behind your head.
            </Text>
            <GradientButton
              colors={['#17a2b8', '#117a8b']}
              style={styles.tipsButton}
              onPress={() => setShowTips(false)}
            >
              Close
            </GradientButton>
          </View>
        </View>
      </Modal>

      <Modal visible={showHistory} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Exercise History</Text>
            {exerciseHistory.map((entry, index) => (
              <View key={index} style={styles.historyEntry}>
                <Text style={styles.modalText}>
                  Date: {entry.date.toLocaleDateString()}, Sit-ups: {entry.situps}, Duration: {entry.duration} sec
                </Text>
              </View>
            ))}
            <GradientButton
              colors={['#ffc107', '#e0a800']}
              style={styles.historyButton}
              onPress={() => setShowHistory(false)}
            >
              Close
            </GradientButton>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Situp;
