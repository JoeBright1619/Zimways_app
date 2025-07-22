// components/CustomButton.js
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import style from '../constants/colors_fonts';

type Props = {
  title: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
};

export default function CustomButton({ title, onPress, style, textStyle }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: style.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: style.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
