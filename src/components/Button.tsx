import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ButtonProps {
  backgroundColor?: string; // Optional background color (default: '#9C27B0')
  textColor?: string; // Optional text color (default: white)
  title: string; // Required button text
  onPress: () => void; // Required onPress function
  icon?: string | any; // Optional icon name (from MaterialIcons or an image)
  style?: StyleProp<ViewStyle>; // Optional style for outer container
  textStyle?: StyleProp<TextStyle>; // Optional text style for button text
  iconSize?: number; // Optional size for the icon (default: 20)
}

const Button: React.FC<ButtonProps> = ({
  backgroundColor = '#9C27B0', // Default background color
  textColor = 'white', // Default text color
  title,
  onPress,
  icon,
  style,
  textStyle,
  iconSize = 20, // Default icon size
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}, style]} // Merge default and custom styles
      onPress={onPress}>
      <View style={styles.iconContainer}>
        {typeof icon === 'string' ? (
          // Render icon from react-native-vector-icons
          <Icon name={icon} size={iconSize} color={textColor} />
        ) : icon ? (
          // Render image if the icon is an image source
          <Image
            source={icon}
            style={[styles.iconImage, {width: iconSize, height: iconSize}]}
          />
        ) : null}
      </View>
      <Text style={[styles.text, {color: textColor}, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    // elevation: 2, // For Android shadow effect
    // shadowColor: '#000', // For iOS shadow effect
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  iconContainer: {
    marginRight: 10, // Space between icon and text
  },
  iconImage: {
    resizeMode: 'contain', // Ensures the image fits the icon container
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
