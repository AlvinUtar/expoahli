import { SafeAreaView, ScrollView, View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig'; // Import your Firestore configuration

const UserWorkoutList = ({ userWorkout }) => {
    const [completedExercises, setCompletedExercises] = useState({});
    const [docCompletion, setDocCompletion] = useState({});
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    if (!userWorkout || !Array.isArray(userWorkout) || userWorkout.length === 0) {
        return (
            <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No Workout Data Available</Text>
            </View>
        );
    }

    // Convert docId to numbers and sort by docId in descending order
    const sortedWorkouts = [...userWorkout].sort((a, b) => {
        const idA = parseInt(a.docId, 10);
        const idB = parseInt(b.docId, 10);
        return idB - idA; // Descending order
    });

    // Handle toggle of exercise completion
    const handleExerciseToggle = async (docId, day, exerciseIndex) => {
        setCompletedExercises(prev => {
            const updated = {
                ...prev,
                [docId]: {
                    ...prev[docId],
                    [day]: {
                        ...prev[docId]?.[day],
                        [exerciseIndex]: !prev[docId]?.[day]?.[exerciseIndex]
                    }
                }
            };
            console.log('Updated completedExercises:', updated); // Debug state
            return updated;
        });

        // Update Firestore
        const workoutRef = doc(db, 'UserWorkout', docId);
        try {
            await updateDoc(workoutRef, {
                [`completedExercises.${day}.${exerciseIndex}`]: !completedExercises[docId]?.[day]?.[exerciseIndex]
            });
        } catch (error) {
            console.error('Error updating Firestore:', error);
        }
    };

    // Calculate completion percentage for exercises in a given document
    const calculateDocCompletionPercentage = (docId) => {
        const workoutPlan = sortedWorkouts.find(workout => workout.docId === docId)?.workoutData?.workout_plan;
        if (!workoutPlan || !workoutPlan.workout_schedule) return 0;

        const totalExercises = workoutPlan.workout_schedule.reduce((total, day) => total + day.exercises.length, 0);
        const completedExercisesCount = Object.values(completedExercises[docId] || {}).reduce((total, day) => {
            return total + Object.values(day).filter(Boolean).length;
        }, 0);

        return (completedExercisesCount / totalExercises) * 100;
    };

    // Update doc completion percentages
    useEffect(() => {
        const newDocCompletion = {};
        sortedWorkouts.forEach(workout => {
            newDocCompletion[workout.docId] = calculateDocCompletionPercentage(workout.docId);
        });
        setDocCompletion(newDocCompletion);
    }, [completedExercises]);

    // Render workout schedule
    const renderWorkoutSchedule = ({ item, docId }) => (
        <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleDay}>{item.day}</Text>
            {item.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exerciseContainer}>
                    <TouchableOpacity onPress={() => handleExerciseToggle(docId, item.day, exerciseIndex)}>
                        <MaterialCommunityIcons
                            name={completedExercises[docId]?.[item.day]?.[exerciseIndex] ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={24}
                            color={completedExercises[docId]?.[item.day]?.[exerciseIndex] ? 'green' : 'gray'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDetails}>Sets: {exercise.sets}, Reps: {exercise.reps}, Rest: {exercise.rest}</Text>
                </View>
            ))}
        </View>
    );

    // Render each workout card
    const renderWorkoutCard = ({ item }) => {
        const workoutPlan = item.workoutData?.workout_plan || {};
        const gym = workoutPlan.gym || {};

        return (
            <TouchableOpacity 
                style={styles.workoutCard}
                onPress={() => {
                    setSelectedWorkout(item);
                    setModalVisible(true);
                }}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.gymName}>{gym.name || 'Unknown Gym'}</Text>
                </View>
                <View style={styles.gymDetailsContainer}>
                    <View style={styles.gymInfoContainer}>
                        <Text style={styles.gymAddress}>{gym.address || 'Unknown Address'}</Text>
                        <Text style={styles.gymPrice}>{gym.price || 'Unknown Price'}</Text>
                        <Text style={styles.gymNearby}>{gym.nearby_gym || 'No Nearby Gym'}</Text>
                        <Text style={styles.gymCoordinates}>{gym.geo_coordinates || 'Unknown Coordinates'}</Text>
                        <Text style={styles.gymUrl}>{gym.url ? gym.url : 'Most Recommended Gym'}</Text>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.locationText}>
                        Location: {workoutPlan.location || 'Unknown Location'}
                    </Text>
                    <Text style={styles.bodyPartText}>
                        Body Part: {workoutPlan.body_part || 'Unknown Body Part'}
                    </Text>
                    <Text style={styles.goalText}>
                        Goal: {workoutPlan.goal || 'No Goal Set'}
                    </Text>
                    <Text style={styles.levelText}>
                        Training Level: {workoutPlan.training_level || 'Unknown Level'}
                    </Text>
                    <Text style={styles.completionPercentage}>
                        Completion: {docCompletion[item.docId]?.toFixed(2) || '0.00'}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    // Render exercise detail modal
    const renderExerciseDetailModal = () => {
        if (!selectedWorkout) return null;
    
        const workoutPlan = selectedWorkout.workoutData?.workout_plan || {};
        const completionPercentage = docCompletion[selectedWorkout.docId]?.toFixed(2) || '0.00';
    
        // Combine completion percentage and workout schedule into a single list
        const modalData = [
            { type: 'header', content: `Completion: ${completionPercentage}%` },
            { type: 'schedule', content: workoutPlan.workout_schedule || [] }
        ];
    
        // Render each item based on its type
        const renderItem = ({ item }) => {
            switch (item.type) {
                case 'header':
                    return (
                        <View style={styles.modalHeaderContainer}>
                            <Text style={styles.completionPercentageModal}>
                                {item.content}
                            </Text>
                        </View>
                    );
                case 'schedule':
                    return (
                        <FlatList
                            data={item.content}
                            renderItem={({ item: scheduleItem }) => renderWorkoutSchedule({ item: scheduleItem, docId: selectedWorkout.docId })}
                            keyExtractor={(scheduleItem) => `${scheduleItem.day}-${selectedWorkout.docId}`}
                            ListHeaderComponent={<Text style={styles.scheduleTitle}>Workout Schedule</Text>}
                        />
                    );
                default:
                    return null;
            }
        };
    
        return (
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={modalData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.modalScrollView}
                            ListFooterComponent={
                                <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </Pressable>
                            }
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedWorkouts}
                renderItem={renderWorkoutCard}
                keyExtractor={(item) => item.docId}
                ListEmptyComponent={
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No Workout Data Available</Text>
                    </View>
                }
            />
            {renderExerciseDetailModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    noDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#fce4ec',
    },
    noDataText: {
        fontFamily: 'outfit-medium',
        fontSize: 18,
        color: '#d32f2f',
        textAlign: 'center',
    },
    workoutCard: {
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
        padding: 15,
    },
    cardHeader: {
        backgroundColor: '#e0f7fa',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    gymName: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        color: '#000000',
        marginBottom: 5,
    },
    gymDetailsContainer: {
        paddingVertical: 15,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRadius: 10,
        padding: 15,
    },
    gymInfoContainer: {
        marginLeft: 15,
        flex: 1,
        justifyContent: 'center',
    },
    gymAddress: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#000000',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    gymPrice: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#000000',
        marginBottom: 5,
    },
    gymNearby: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#000000',
        marginBottom: 5,
    },
    gymCoordinates: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#000000',
        marginBottom: 5,
    },
    gymUrl: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#000000',
        marginBottom: 5,
    },
    infoContainer: {
        paddingTop: 15,
    },
    locationText: {
        fontFamily: 'outfit-medium',
        fontSize: 20,
        color: '#d32f2f',
    },
    bodyPartText: {
        fontFamily: 'outfit',
        fontSize: 18,
        color: '#4caf50',
        marginTop: 5,
    },
    goalText: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#ff5722',
        marginTop: 5,
    },
    levelText: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#9e9e9e',
        marginTop: 5,
    },
    scheduleContainer: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f1f8e9',
        borderRadius: 10,
    },
    scheduleDay: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: '#388e3c',
    },
    exerciseContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    exerciseName: {
        fontFamily: 'outfit',
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
        flexWrap: 'wrap',
    },
    exerciseDetails: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#9e9e9e',
        marginLeft: 10,
        flex: 1,
        flexWrap: 'wrap',
    },
    completionPercentage: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: '#4caf50',
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    modalScrollView: {
        flexGrow: 1,
    },
    modalTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        marginBottom: 15,
    },
    completionPercentageModal: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: '#4caf50',
        marginBottom: 15,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#d32f2f',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontFamily: 'outfit-medium',
        fontSize: 16,
    },
    scheduleTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        marginVertical: 10,
        color: '#000',
        textAlign:'center'
    },
});


export default UserWorkoutList;