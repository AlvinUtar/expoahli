import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../configs/FirebaseConfig'

export default function SignIn() {
    const navigation = useNavigation()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [navigation])

    const onSignIn = async () => {
        if (!email || !password) {
            setError('Please enter all details')
            return
        }

        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log('User signed in successfully')
            // Clear the error message on successful sign-in
            setError('')
            router.replace('/mytrip')
            // Navigate to the next screen if needed
        } catch (error) {
            const errorMessage = error.message
            console.error('Sign-in error:', errorMessage)
            setError(errorMessage)  // Set error message to display to the user
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Hi</Text>
            <Text style={styles.subtitle}>Welcome Back</Text>
            <Text style={styles.header}>Please Login</Text>

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}

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

            <TouchableOpacity onPress={onSignIn} style={styles.signInButton}>
                <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('auth/sign-up')} style={styles.createAccountButton}>
                <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        marginTop: 40,
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 30,
        marginTop: 30,
    },
    subtitle: {
        fontFamily: 'outfit',
        fontSize: 30,
        color: Colors.GRAY,
        marginTop: 20,
    },
    header: {
        fontFamily: 'outfit-bold',
        fontSize: 30,
        marginTop: 20,
        marginBottom: 30,
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
    signInButton: {
        padding: 20,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginTop: 50,
    },
    signInText: {
        color: Colors.WHITE,
        textAlign: 'center',
    },
    createAccountButton: {
        padding: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginTop: 30,
        borderWidth: 1,
    },
    createAccountText: {
        color: Colors.GRAY,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
        fontFamily: 'outfit',
    },
})
