import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  size?: number;
};

const SOURCE = require('../assets/images/bitcoin-mark.png');

export default function BitcoinMark({ size = 96 }: Props) {
  const r = Math.round(size * 0.22);
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: r }]}>
      <Image
        source={SOURCE}
        style={{ width: size, height: size, borderRadius: r }}
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
