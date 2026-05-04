import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  length: number;
  filled: number;
  style?: StyleProp<ViewStyle>;
};

export default function PinDots({ length, filled, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[styles.dot, i < filled && styles.dotFilled]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 26,
  },
  dot: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  dotFilled: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
