import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

type Props = {
  size?: number;
  source?: number;
};

const DEFAULT_SOURCE = require('../assets/images/welcome-category-placeholder.svg');

export default function WelcomeCategoryPlaceholderIcon({
  size = 44,
  source = DEFAULT_SOURCE,
}: Props) {
  const r = size / 2;
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: r }]}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
