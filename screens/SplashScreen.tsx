import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import BitcoinMark from '@/components/BitcoinMark';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1300);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <View style={styles.flex}>
      <BitcoinMark width={178} height={178} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
