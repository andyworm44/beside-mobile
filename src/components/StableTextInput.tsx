import React, { useState, useCallback } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface StableTextInputProps extends TextInputProps {
  onTextChange?: (text: string) => void;
}

export default function StableTextInput({ 
  onTextChange, 
  onChangeText, 
  ...props 
}: StableTextInputProps) {
  const [internalValue, setInternalValue] = useState(props.value || '');

  const handleTextChange = useCallback((text: string) => {
    setInternalValue(text);
    if (onTextChange) {
      onTextChange(text);
    }
    if (onChangeText) {
      onChangeText(text);
    }
  }, [onTextChange, onChangeText]);

  return (
    <TextInput
      {...props}
      value={internalValue}
      onChangeText={handleTextChange}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FFE0E0',
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
});

