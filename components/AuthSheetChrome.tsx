import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

const AUTH_HEADER_BG = require('../assets/images/auth-header-bg.svg');

type Props = {
  onBack: () => void;
  children: ReactNode;
};

/** Серый верх со стрелкой «назад», ниже белая панель со скруглением — макет login/register. */
export default function AuthSheetChrome({ onBack, children }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.headerZone}>
        <Image
          pointerEvents="none"
          source={AUTH_HEADER_BG}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        <SafeAreaView edges={['top']} style={styles.topInset}>
          <View style={styles.headerRow}>
            <Pressable
              hitSlop={12}
              onPress={onBack}
              style={styles.backHit}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color={colors.text}
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.whitePanel}>
        <SafeAreaView edges={['bottom']} style={styles.whiteInset}>
          {children}
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cardMuted,
  },
  headerZone: {
    position: 'relative',
    backgroundColor: colors.cardMuted,
    overflow: 'hidden',
  },
  topInset: {
    backgroundColor: 'transparent',
  },
  headerRow: {
    paddingHorizontal: 22,
    paddingTop: 4,
    paddingBottom: 12,
  },
  backHit: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  whitePanel: {
    flex: 1,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  whiteInset: {
    flex: 1,
  },
});
