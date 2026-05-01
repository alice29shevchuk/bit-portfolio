import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BitcoinMark from '@/components/BitcoinMark';
import type { MainTabParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = BottomTabScreenProps<MainTabParamList, 'PortfolioTab'>;

export default function PortfolioScreen(_props: Props) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('portfolio.title')}</Text>
        <Text style={styles.sub}>{t('portfolio.subtitle')}</Text>
      </View>
      <View style={styles.hero}>
        <BitcoinMark size={72} />
        <Text style={styles.hint}>{t('portfolio.hint')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 22, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  sub: { marginTop: 6, fontSize: 15, color: colors.muted },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  hint: {
    marginTop: 20,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
