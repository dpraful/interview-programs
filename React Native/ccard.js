import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

const CCard = ({
  children,
  image,
  imageStyle,
  style,
  padding = 20,
  radius = 15,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: radius,
          padding,
        },
        style,
      ]}>

      {/* Optional Image */}
      {image && (
        <Image
          source={image}
          style={[
            styles.image,
            imageStyle,
          ]}
          resizeMode="cover"
        />
      )}

      {/* Card Content */}
      {children}

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',

    elevation: 5,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default CCard;