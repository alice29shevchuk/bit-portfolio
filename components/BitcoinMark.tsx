import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  size?: number;
};

export default function BitcoinMark({ size = 96 }: Props) {
  const r = Math.round(size * 0.22);
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: r }]}>
      <Text
        style={[
          styles.glyph,
          { fontSize: size * 0.42, marginTop: -size * 0.04 },
        ]}
      >
        ₿
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  glyph: {
    color: colors.onAccent,
    fontWeight: '700',
  },
});
