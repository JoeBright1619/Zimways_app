// components/KeyboardDismissWrapper.tsx
import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';

const KeyboardDismissWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardDismissWrapper;