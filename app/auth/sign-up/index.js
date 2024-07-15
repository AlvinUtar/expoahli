import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useNavigation } from 'expo-router'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../configs/FirebaseConfig'

export default function SignUp() {
  const navigation = useNavigation()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

  const OnCreateAccount = async () => {
    if (!email || !password || !fullName) {
      setError('Please enter all details')
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created successfully')
      // Clear the error message on successful sign-up
      setError('')
      // Navigate to the sign-in screen or another screen as needed
    } catch (error) {
      const errorMessage = error.message
      console.error('Sign-up error:', errorMessage)
      setError(errorMessage)  // Set error message to display to the user
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Create New Account</Text>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter Username'
          onChangeText={(value) => setFullName(value)}
          value={fullName}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          placeholder='Enter Email'
          value={email}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(value) => setPassword(value)}
          placeholder='Enter Password'
          value={password}
        />
      </View>
      
      <TouchableOpacity onPress={OnCreateAccount} style={styles.signUpButton}>
        <Text style={styles.signUpText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('auth/sign-in')} style={styles.signInButton}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'outfit',
  },
  inputContainer: {
    marginTop: 50,
  },
  label: {
    fontFamily: 'outfit',
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.GRAY,
    fontFamily: 'outfit',
  },
  signUpButton: {
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    marginTop: 50,
  },
  signUpText: {
    color: Colors.WHITE,
    textAlign: 'center',
  },
  signInButton: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginTop: 30,
    borderWidth: 1,
  },
  signInText: {
    color: Colors.GRAY,
    textAlign: 'center',
  },
})
