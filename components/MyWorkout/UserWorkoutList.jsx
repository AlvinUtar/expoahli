import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import React from 'react';

const UserWorkoutList = ({ userWorkout }) => {
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

    // Render workout schedule
    const renderWorkoutSchedule = ({ item }) => (
        <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleDay}>{item.day}</Text>
            {item.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseContainer}>
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
        const gymImageUrl = gym.gym_image_url || 'https://via.placeholder.com/150';
        const locationInfo = item.locationInfo || {};
        const locationImageUrl = locationInfo.photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : gymImageUrl;

        return (
            <View style={styles.workoutCard}>
                <Image
                    source={{ uri: locationImageUrl }}
                    style={styles.locationImage}
                    onError={(e) => {
                        console.log('Image fetch error:', e.nativeEvent.error);
                        // Optionally set a fallback image here
                    }}
                />
                <View style={styles.gymDetailsContainer}>
                    <Image
                        source={{ uri: gymImageUrl }}
                        style={styles.gymImage}
                    />
                    <View style={styles.gymInfoContainer}>
                        <Text style={styles.gymName}>{gym.name || 'Unknown Gym'}</Text>
                        <Text style={styles.gymAddress}>{gym.address || 'Unknown Address'}</Text>
                        <Text style={styles.gymPrice}>{gym.price || 'Unknown Price'}</Text>
                        <Text style={styles.gymNearby}>{gym.nearby_gym || 'No Nearby Gym'}</Text>
                        <Text style={styles.gymCoordinates}>{gym.geo_coordinates || 'Unknown Coordinates'}</Text>
                        <Text style={styles.gymUrl}>{gym.url || 'No URL Available'}</Text>
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
                </View>
                <FlatList
                    data={workoutPlan.workout_schedule || []}
                    renderItem={renderWorkoutSchedule}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    };

    return (
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
    );
};

const styles = StyleSheet.create({
    noDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    noDataText: {
        fontFamily: 'outfit-medium',
        fontSize: 18,
        color: 'gray',
    },
    workoutCard: {
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: 'white',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    locationImage: {
        width: '100%',
        height: 240,
        borderRadius: 15,
    },
    gymDetailsContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    gymImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    gymInfoContainer: {
        marginLeft: 15,
        flex: 1,
        justifyContent: 'center',
    },
    gymName: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: 'black',
    },
    gymAddress: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: 'gray',
    },
    gymPrice: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
    gymNearby: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
    gymCoordinates: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
    gymUrl: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: 'blue',
        marginTop: 5,
    },
    infoContainer: {
        padding: 15,
    },
    locationText: {
        fontFamily: 'outfit-medium',
        fontSize: 20,
        color: 'black',
    },
    bodyPartText: {
        fontFamily: 'outfit',
        fontSize: 18,
        color: 'gray',
        marginTop: 5,
    },
    goalText: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: 'darkgray',
        marginTop: 5,
    },
    levelText: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: 'darkgray',
        marginTop: 5,
    },
    scheduleContainer: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    scheduleDay: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        color: 'black',
    },
    exerciseContainer: {
        marginTop: 10,
    },
    exerciseName: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: 'black',
    },
    exerciseDetails: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: 'gray',
    },
});

export default UserWorkoutList;
