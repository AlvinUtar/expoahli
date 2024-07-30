import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, SafeAreaView, Alert } from 'react-native';
import { auth } from '../../configs/FirebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const Profile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Signed Out', 'You have been signed out successfully.');
        router.push('auth/sign-in'); // Ensure this path is correct
      })
      .catch((error) => {
        Alert.alert('Sign Out Error', error.message);
      });
  };

  // Function to get the username from email
  const getUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <View style={styles.profileHeader}>
          <Image
            source={require('./../../assets/images/userprofile.jpg')} // Replace with user's profile image URL
            style={styles.profileImage}
          />
          <Text style={styles.username}>{getUsernameFromEmail(user.email) || 'User'}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      ) : (
        <Text style={styles.message}>No user is logged in</Text>
      )}
      <View style={styles.profileDetails}>
        <Text style={styles.detailTitle}>Bio</Text>
        <Text style={styles.bio}>
          Enthusiastic developer with a passion for building great applications. Loves exploring new technologies and frameworks.
        </Text>
        <Button title="Edit Profile" onPress={() => alert('Edit Profile')} />
        {user && (
          <Button title="Log Out" onPress={handleLogout} color="#dc3545" />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  username: {
    fontSize: 24,
    fontFamily: 'outfit-bold', // Apply custom font
    fontWeight: 'bold',
    marginVertical: 10,
  },
  email: {
    fontSize: 16,
    fontFamily: 'outfit-medium', // Apply custom font
    color: '#6c757d',
  },
  message: {
    fontSize: 16,
    fontFamily: 'outfit-medium', // Apply custom font
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
  },
  profileDetails: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    elevation: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold', // Apply custom font
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'outfit-medium', // Apply custom font
    color: '#333',
    marginBottom: 20,
  },
});

export default Profile;
