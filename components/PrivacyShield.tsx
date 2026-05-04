import { StyleSheet, View } from 'react-native';

import BitcoinMark from '@/components/BitcoinMark';

type Props = {
  visible: boolean;
};

export default function PrivacyShield({ visible }: Props) {
  if (!visible) return null;

  return (
    <View
      style={styles.overlay}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="auto"
    >
      <View style={styles.fill}>
        <BitcoinMark width={132} height={132} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    elevation: 99999,
  },
  fill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
