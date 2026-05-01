import { Modal, StyleSheet, View } from 'react-native';

import BitcoinMark from '@/components/BitcoinMark';

type Props = {
  visible: boolean;
};

export default function PrivacyShield({ visible }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={false}
      statusBarTranslucent
    >
      <View style={styles.fill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.tilt}>
          <BitcoinMark size={132} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tilt: {
    transform: [{ rotate: '-10deg' }],
  },
});
