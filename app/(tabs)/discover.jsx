import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, Button } from 'react-native';
import { db, auth, storage } from '../../configs/FirebaseConfig'; // Adjust the path as needed
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function Discover() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [image, setImage] = useState(null);

  // Listen for authentication changes to get the current user
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

  // Fetch posts when the current user is set
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

  // Handle adding a new post with optional image and text
  const handleAddPost = async () => {
    if (!currentUser) return;

    setPosting(true);

    try {
      let imageUrl = '';

      if (image) {
        // Create a reference to the Firebase Storage location
        const imageRef = ref(storage, `images/${new Date().toISOString()}_${image.split('/').pop()}`);

        // Convert image URI to blob
        const response = await fetch(image);
        const blob = await response.blob();

        // Upload the blob to Firebase Storage
        await uploadBytes(imageRef, blob);

        // Get the download URL for the uploaded image
        imageUrl = await getDownloadURL(imageRef);
      }

      const email = currentUser.email || '';

      await addDoc(collection(db, 'discover'), {
        content: newPost.trim() || null, // Allow content to be null
        timestamp: new Date().toISOString(),
        userId: currentUser.uid,
        userEmail: email,
        imageUrl,
      });

      console.log("Post added successfully");

      // Refresh the posts list
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

  // Pick an image from the device's library
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

  // Remove the selected image
  const removeImage = () => {
    setImage(null);
  };

  // Render individual post item
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.userEmail}>{item.userEmail}</Text>
      {item.content && <Text style={styles.postContent}>{item.content}</Text>}
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.postImage} />}
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Discover</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newPost}
          onChangeText={setNewPost}
          placeholder='Write a new post...'
        />
        <TouchableOpacity onPress={handleAddPost} style={styles.addButton} disabled={posting}>
          {posting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <Button title="Pick an image from camera roll" onPress={pickImage} />

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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  postContent: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: '80%',
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
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
