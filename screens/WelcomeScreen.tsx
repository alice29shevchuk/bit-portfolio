import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BitcoinMark from '@/components/BitcoinMark';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <BitcoinMark size={48} />

        <View style={styles.decorColumn}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.decorCard}>
              <View style={styles.decorDots}>
                <View style={[styles.miniDot, { backgroundColor: colors.accent }]} />
                <View style={[styles.miniDot, { backgroundColor: colors.accentLight }]} />
                <View style={[styles.miniDot, { backgroundColor: colors.border }]} />
              </View>
              <Text style={styles.decorText}>{t('welcome.decorLine', { n: i })}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signIn}>{t('welcome.signIn')}</Text>
          </Pressable>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryBtnText}>{t('welcome.signUp')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
  },
  decorColumn: { marginTop: 36, gap: 12, flex: 1 },
  decorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardMuted,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  decorDots: { flexDirection: 'row', gap: 6, marginRight: 14 },
  miniDot: { width: 10, height: 10, borderRadius: 5 },
  decorText: { flex: 1, color: colors.muted, fontSize: 14 },
  footer: { paddingTop: 28, gap: 18 },
  signIn: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: colors.onAccent,
    fontWeight: '700',
    fontSize: 17,
  },
});
