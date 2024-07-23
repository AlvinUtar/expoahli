import React, { useState, useEffect, useRef } from 'react';
import { Button, SafeAreaView, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, Animated } from 'react-native';
import { db, auth, storage } from '../../configs/FirebaseConfig'; // Adjust the path as needed
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // For icon
import { Share } from 'react-native';

export default function Discover() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [image, setImage] = useState(null);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log('No user signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchPosts = async () => {
      try {
        console.log("Fetching posts...");
        const postsCollection = collection(db, 'discover');
        const q = query(postsCollection, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No posts found");
        }

        const postsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log("Posts fetched:", postsArray);
        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser]);

  const handleAddPost = async () => {
    if (!currentUser) return;

    setPosting(true);

    try {
      let imageUrl = '';

      if (image) {
        const imageRef = ref(storage, `images/${new Date().toISOString()}_${image.split('/').pop()}`);
        const response = await fetch(image);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const email = currentUser.email || '';

      await addDoc(collection(db, 'discover'), {
        content: newPost.trim() || null,
        timestamp: new Date().toISOString(),
        userId: currentUser.uid,
        userEmail: email,
        imageUrl,
      });

      console.log("Post added successfully");

      const postsCollection = collection(db, 'discover');
      const q = query(postsCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log("Posts after adding:", postsArray);

      setNewPost('');
      setImage(null);
      setPosts(postsArray);

      Alert.alert("Success", "Post added successfully!");
    } catch (error) {
      console.error("Error adding post:", error);
      Alert.alert("Error", "There was an issue adding the post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image selected:", result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSharePost = async (post) => {
    try {
      const shareOptions = {
        title: 'Check out this post!',
        message: post.content,
        url: post.imageUrl,
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share post.');
      console.error('Error sharing post: ', error);
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.userEmail}>{item.userEmail}</Text>
      {item.content && <Text style={styles.postContent}>{item.content}</Text>}
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.postImage} />}
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      <TouchableOpacity onPress={() => handleSharePost(item)} style={styles.shareButton}>
        <MaterialIcons name="share" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  const buttonOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Discover</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newPost}
          onChangeText={setNewPost}
          placeholder='Write a new post...'
          placeholderTextColor='#888'
        />
        <TouchableOpacity onPress={handleAddPost} style={styles.addButton} disabled={posting}>
          {posting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.pickImageButtonContainer, { opacity: buttonOpacity }]}>
        <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
          <Text style={styles.pickImageButtonText}>Pick an image from camera roll</Text>
        </TouchableOpacity>
      </Animated.View>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
            <Text style={styles.removeImageButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          onScroll={handleScroll}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 30,
    fontFamily:'outfit-bold',
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontFamily: 'outfit-medium',
    backgroundColor: '#f9f9f9', // Subtle background color for input
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
  postContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: '#333',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#888',
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: '75%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    marginLeft: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  shareButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    zIndex: 1,
  },
  pickImageButtonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  pickImageButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    maxWidth: 300,
    alignSelf: 'center',
  },
  pickImageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'outfit-bold',
  },
});
