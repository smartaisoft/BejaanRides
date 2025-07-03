import React, {useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  error?: string;
};

const PhoneNumberInput: React.FC<Props> = ({
  value,
  onChange,
  onValidityChange,
  error,
}) => {
  const phoneInputRef = useRef<PhoneInput>(null);

  const handleChange = (formattedText: string) => {
    onChange(formattedText);

    const isValid =
      phoneInputRef.current?.isValidNumber(formattedText) || false;
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  };

  return (
    <View style={styles.container}>
      <PhoneInput
        ref={phoneInputRef}
        defaultValue={value}
        defaultCode="PK"
        layout="first"
        onChangeFormattedText={handleChange}
        withShadow
        autoFocus={false}
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.textInput}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  container: {marginVertical: 10},
  phoneContainer: {
    width: '100%',
    height: 45,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
});
