import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, Modal, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const CurrentLocationMap = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(INITIAL_REGION);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGym, setSelectedGym] = useState(null);
  const mapRef = useRef(null);
  const tapTimeoutRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      fetchNearbyGyms(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  const fetchNearbyGyms = async (latitude, longitude) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=gym&key=${GOOGLE_MAPS_API_KEY}`
    );
    setGyms(response.data.results);
    setLoading(false);
  };

  const getGymImageUrl = (photo_reference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${GOOGLE_MAPS_API_KEY}`;
  };

  const handleTap = async (item) => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
      showGymDetails(item);
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        tapTimeoutRef.current = null;
        navigateToLocation(item.geometry.location.lat, item.geometry.location.lng);
      }, 300);
    }
  };

  const navigateToLocation = (latitude, longitude) => {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const showGymDetails = async (item) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_MAPS_API_KEY}`
    );
    setSelectedGym(response.data.result);
  };

  const goToUserLocation = () => {
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const calculateDistance = (lat, lng) => {
    if (!location) return 0;
    const R = 6371;
    const dLat = (lat - location.latitude) * (Math.PI / 180);
    const dLng = (lng - location.longitude) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(location.latitude * (Math.PI / 180)) * Math.cos(lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            showsUserLocation={true}
          >
            {location && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="You are here"
              />
            )}
            {gyms.map(gym => (
              <Marker
                key={gym.place_id}
                coordinate={{
                  latitude: gym.geometry.location.lat,
                  longitude: gym.geometry.location.lng,
                }}
                title={gym.name}
                onPress={() => handleTap(gym)}
              />
            ))}
          </MapView>
          <TouchableOpacity
            style={styles.button}
            onPress={goToUserLocation}
          >
            <Text style={styles.buttonText}>🙍‍♂️</Text>
          </TouchableOpacity>
          <View style={styles.listContainer}>
            <FlatList
              data={gyms}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleTap(item)}>
                  <View style={styles.card}>
                    <Image
                      source={item.photos && item.photos.length > 0
                        ? { uri: getGymImageUrl(item.photos[0].photo_reference) }
                        : require('./../../assets/images/default-gym.jpg')
                      }
                      style={styles.image}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.rating}>Rating: {item.rating} ⭐</Text>
                    <Text style={styles.distance}>Distance: {calculateDistance(item.geometry.location.lat, item.geometry.location.lng)} km</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.place_id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </>
      )}
      {selectedGym && (
        <Modal
          visible={!!selectedGym}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedGym(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.cardContainer}>
                <Text style={styles.modalTitle}>{selectedGym.name}</Text>
                <Image
                  source={selectedGym.photos && selectedGym.photos.length > 0
                    ? { uri: getGymImageUrl(selectedGym.photos[0].photo_reference) }
                    : require('./../../assets/images/default-gym.jpg')
                  }
                  style={styles.modalImage}
                />
                <Text style={styles.modalRating}>Rating: {selectedGym.rating}</Text>
                <Text style={styles.modalDistance}>Distance: {calculateDistance(selectedGym.geometry.location.lat, selectedGym.geometry.location.lng)} km</Text>
                <Text style={styles.modalAddress}>Address: {selectedGym.vicinity || 'Not available'}</Text>
                <Text style={styles.modalPhone}>Phone: {selectedGym.formatted_phone_number || 'Not available'}</Text>
                <Text style={styles.modalWebsite}>Website: {selectedGym.website ? <Text onPress={() => Linking.openURL(selectedGym.website)}>{selectedGym.website}</Text> : 'Not available'}</Text>
                <Text style={styles.modalReviews}>User Ratings Total: {selectedGym.user_ratings_total || 'Not available'}</Text>
                <Text style={styles.modalStatus}>Business Status: {selectedGym.business_status || 'Not available'}</Text>
                <Text style={styles.modalPriceLevel}>Price Level: {selectedGym.price_level !== undefined ? '$'.repeat(selectedGym.price_level) : 'Not available'}</Text>
              </View>
              <FlatList
                style={styles.reviewsContainer}
                data={selectedGym.reviews}
                renderItem={({ item }) => (
                  <View style={styles.reviewContainer}>
                    <Image
                      source={item.profile_photo_url ? { uri: item.profile_photo_url } : require('./../../assets/images/userprofile.jpg')}
                      style={styles.reviewImage}
                    />
                    <View style={styles.reviewContent}>
                      <Text style={styles.reviewAuthor}>{item.author_name}</Text>
                      <Text style={styles.reviewText}>{item.text}</Text>
                      <Text style={styles.reviewRating}>Rating: {item.rating} ⭐</Text>
                    </View>
                  </View>
                )}
                keyExtractor={item => item.author_name}
                ListEmptyComponent={<Text style={styles.noReviews}>No reviews available</Text>}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setSelectedGym(null)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    width: 200, // Fixed width
    height: 230, // Fixed height
    justifyContent: 'center', // Center content vertically
  },
  image: {
    width: '100%',
    height: 120, // Fixed height for image
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    fontWeight: 'bold',
    marginTop: 10,
  },
  rating: {
    marginTop: 5,
    fontFamily: 'outfit-medium',
  },
  distance: {
    marginTop: 5,
    color: 'gray',
    fontFamily: 'outfit-medium',
  },
  button: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 24,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%', // Prevents modal from getting too tall
  },
  cardContainer: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  modalRating: {
    marginTop: 10,
    fontFamily: 'outfit-medium',
  },
  modalDistance: {
    marginTop: 5,
    color: 'gray',
    fontFamily: 'outfit-medium',
  },
  modalAddress: {
    marginTop: 10,
    fontFamily: 'outfit-medium',
  },
  modalPhone: {
    marginTop: 10,
    fontFamily: 'outfit-medium',
  },
  modalWebsite: {
    marginTop: 10,
    fontFamily: 'outfit-medium',
  },
  modalReviews: {
    marginTop: 10,
    fontFamily: 'outfit-medium',
  },
  modalStatus: {
    marginTop: 10,
    fontFamily: 'outfit-medium',
  },
  modalPriceLevel: {
    marginTop: 10,
    fontFamily: 'outfit-medium',
  },
  reviewsContainer: {
    marginTop: 20,
    maxHeight: 300, // Adjust based on your design
  },
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  reviewImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    fontFamily: 'outfit-bold',
  },
  reviewText: {
    marginTop: 5,
    fontFamily: 'outfit-medium',
  },
  reviewRating: {
    marginTop: 5,
    fontFamily: 'outfit-medium',
  },
  noReviews: {
    fontFamily: 'outfit-medium',
    color: 'gray',
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign:'center'
  },
});

export default CurrentLocationMap;
