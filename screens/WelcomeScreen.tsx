import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import WelcomeCategoryCard from '@/components/WelcomeCategoryCard';
import { welcomeCategories } from '../constants/welcomeCategories';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const COL_GAP = 10;
const ROW_GAP = 10;
const SCREEN_PAD = 22;

/** Должен совпадать с `minHeight` у `WelcomeCategoryCard`. */
const CATEGORY_CARD_MIN_HEIGHT = 136;

/** Правая колонка начинается чуть ниже середины первой левой карточки. */
const RIGHT_COL_START_FRAC = 0.52;

const WELCOME_BITCOIN_VECTOR = require('../assets/images/welcome-bitcoin-vector.svg');
/** Тот же арт, что и у шапки auth (`bg.svg`). */
const WELCOME_FOOTER_BG = require('../assets/images/auth-header-bg.svg');

/** viewBox Vector.svg: 62×82 */
const VECTOR_ASPECT = 82 / 62;

export default function WelcomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();

  const categoryColumnWidth = Math.floor(
    (windowWidth - SCREEN_PAD * 2 - COL_GAP) / 2,
  );

  const innerPad = 24;
  const maxInnerW = Math.max(40, categoryColumnWidth - innerPad);
  const maxInnerHBase = CATEGORY_CARD_MIN_HEIGHT - 28;
  let vectorWidth = maxInnerW;
  let vectorHeight = Math.round(vectorWidth * VECTOR_ASPECT);
  if (vectorHeight > maxInnerHBase) {
    vectorHeight = maxInnerHBase;
    vectorWidth = Math.round(vectorHeight / VECTOR_ASPECT);
  }

  const [heroTileHeight, setHeroTileHeight] = useState(0);

  const onHeroTileLayout = useCallback((e: LayoutChangeEvent) => {
    setHeroTileHeight(e.nativeEvent.layout.height);
  }, []);

  const rightColumnOffset =
    heroTileHeight > 0
      ? Math.round(heroTileHeight * RIGHT_COL_START_FRAC)
      : Math.round(CATEGORY_CARD_MIN_HEIGHT * RIGHT_COL_START_FRAC);

  const c = welcomeCategories;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.masonry}>
          <View style={[styles.masonryCol, styles.colGap]}>
            <View
              style={[
                styles.heroOrangeTile,
                { width: categoryColumnWidth, minHeight: CATEGORY_CARD_MIN_HEIGHT },
              ]}
              onLayout={onHeroTileLayout}
            >
              <Image
                source={WELCOME_BITCOIN_VECTOR}
                style={{ width: vectorWidth, height: vectorHeight }}
                contentFit="contain"
              />
            </View>

            <View style={styles.colSpacer} />

            <WelcomeCategoryCard
              title={t(c.crowdRealEstate.titleKey)}
              clusterIcons={c.crowdRealEstate.icons}
            />

            <View style={styles.colSpacer} />

            <WelcomeCategoryCard
              title={t(c.etfs.titleKey)}
              clusterIcons={c.etfs.icons}
            />
          </View>

          <View style={[styles.masonryCol, { paddingTop: rightColumnOffset }]}>
            <WelcomeCategoryCard
              title={t(c.crowdLending.titleKey)}
              clusterIcons={c.crowdLending.icons}
            />

            <View style={styles.colSpacer} />

            <WelcomeCategoryCard
              title={t(c.commodities.titleKey)}
              clusterIcons={c.commodities.icons}
            />

            <View style={styles.colSpacer} />

            <WelcomeCategoryCard
              title={t(c.crypto.titleKey)}
              clusterIcons={c.crypto.icons}
            />
          </View>
        </View>

        <View style={styles.footerWrap}>
          <Image
            pointerEvents="none"
            source={WELCOME_FOOTER_BG}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F7' },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_PAD,
    paddingTop: 8,
    paddingBottom: 28,
  },
  masonry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  masonryCol: {
    flex: 1,
    minWidth: 0,
  },
  colSpacer: {
    height: ROW_GAP,
  },
  colGap: {
    marginRight: COL_GAP,
  },
  heroOrangeTile: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerWrap: {
    flexGrow: 1,
    marginTop: 'auto',
    marginHorizontal: -SCREEN_PAD,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  footer: {
    paddingHorizontal: SCREEN_PAD,
    paddingTop: 32,
    gap: 18,
  },
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
