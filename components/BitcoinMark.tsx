import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  width?: number;
  height?: number;
};

const SOURCE = require('../assets/images/bitcoin-mark.png');

export default function BitcoinMark({ width = 96, height = 96 }: Props) {
  const r = Math.round(Math.min(width, height) * 0.22);
  return (
    <View style={[styles.wrap, { width, height, borderRadius: r }]}>
      <Image
        source={SOURCE}
        style={{ width, height, borderRadius: r }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
