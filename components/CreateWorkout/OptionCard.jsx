import { View, Text, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';

export default function OptionCard({ option, selectedOption }) {
  return (
    <View
      style={[
        {
          padding: 25,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: Colors.LIGHT_GRAY,
          borderRadius: 15,
        },
        selectedOption?.id === option?.id && { borderWidth: 3 },
      ]}
    >
      <View>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'outfit-bold',
          }}
        >
          {option?.title}
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'outfit',
            color: Colors.GRAY,
          }}
        >
          {option?.desc}
        </Text>
      </View>
      {option.icon ? (
        <Text
          style={{
            fontSize: 40,
          }}
        >
          {option.icon}
        </Text>
      ) : (
        <Image
          source={option.image}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
          }}
        />
      )}
    </View>
  );
}
