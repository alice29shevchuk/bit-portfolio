import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { useHomePosts } from '@/hooks/usePostsQueries';
import type {
  MainAppStackParamList,
  MainTabParamList,
} from '@/navigation/types';
import type { RootState } from '@/store/index';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { resolveDisplayName } from '@/utils/displayName';

const TASK_CARD_ART = require('../assets/images/home-test-task.png');
const BEFORE_CARD_LINK_ICON = require('../assets/images/before-card-link-icon.svg');
const HOME_SCREEN_BG = '#F2F3F5';

function capitalizeFirstLetter(text: string): string {
  const s = text.trim();
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<MainAppStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const user = useSelector((s: RootState) => s.auth.user);
  const override = useSelector((s: RootState) => s.settings.displayNameOverride);
  const name = resolveDisplayName(user, override) || '—';
  const { data, isPending, isError } = useHomePosts();

  const openPost = (id: number) => {
    navigation.navigate('PostDetail', { postId: id });
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.accent, colors.accentLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <Text style={styles.heroSmall}>{t('home.welcomeLine')}</Text>
          <Text style={styles.heroName}>{name}</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.taskCard}>
          <View style={styles.taskCardRow}>
            <View style={styles.taskCardBody}>
              <Text style={styles.taskTitle}>{t('home.testTask')}</Text>
              <Text style={styles.taskSub}>{t('home.testTaskBody')}</Text>
              <Pressable style={styles.taskLink}>
                <Text style={styles.taskLinkText}>{t('home.goToCall')}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.accent}
                />
              </Pressable>
            </View>
            <Image
              source={TASK_CARD_ART}
              style={styles.taskCardImage}
              contentFit="contain"
              accessibilityIgnoresInvertColors
            />
          </View>
        </View>

        <Text style={styles.section}>{t('home.beforeStart')}</Text>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.beforeRowOuter}
          contentContainerStyle={styles.beforeRow}
        >
          <View style={[styles.beforeCard, styles.beforeDark]}>
            <View style={styles.beforeCardTop}>
              <Image
                source={BEFORE_CARD_LINK_ICON}
                style={styles.beforeCardIconImg}
                contentFit="contain"
              />
              <Text style={styles.beforeTitle} numberOfLines={3}>
                {t('home.linkBank')}
              </Text>
            </View>
            <View style={styles.beforeCardBottom}>
              <Text style={styles.beforeMeta}>{t('home.steps', { n: 2 })}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={colors.onAccent}
              />
            </View>
          </View>
          <View style={[styles.beforeCard, styles.beforePink]}>
            <View style={styles.beforeCardTop}>
              <Image
                source={BEFORE_CARD_LINK_ICON}
                style={styles.beforeCardIconImg}
                contentFit="contain"
              />
              <Text style={[styles.beforeTitle, styles.beforeTitlePink]} numberOfLines={3}>
                {t('home.addWallet')}
              </Text>
            </View>
            <View style={styles.beforeCardBottom}>
              <Text style={styles.beforeMetaDark}>{t('home.steps', { n: 3 })}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={colors.muted}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.postsHeader}>
          <Text style={styles.postsTitle}>{t('home.posts')}</Text>
          <Pressable
            onPress={() => navigation.navigate('SearchTab')}
            hitSlop={8}
            style={styles.seeAllHit}
          >
            <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
          </Pressable>
        </View>

        {isPending ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 16 }} />
        ) : null}
        {isError ? (
          <Text style={styles.err}>{t('post.errorLoad')}</Text>
        ) : null}

        <View style={styles.postCards}>
          {(data ?? []).map((post) => (
            <Pressable
              key={post.id}
              onPress={() => openPost(post.id)}
              style={styles.postCard}
            >
              <Text style={styles.postCardTitle} numberOfLines={3}>
                {capitalizeFirstLetter(post.title)}
              </Text>
              <Text style={styles.postCardBody} numberOfLines={8}>
                {capitalizeFirstLetter(post.body)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: HOME_SCREEN_BG },
  hero: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    height: 250,
    overflow: 'hidden',
  },
  heroSafe: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSmall: {
    color: colors.onAccent,
    opacity: 0.95,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroName: {
    color: colors.onAccent,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
    marginTop: -12,
    backgroundColor: 'transparent',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 20,
  },
  taskCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  taskCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  taskCardBody: {
    flex: 1,
    minWidth: 0,
  },
  taskCardImage: {
    width: 80,
    height: 80,
    flexShrink: 0,
  },
  taskTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  taskSub: { marginTop: 8, color: colors.muted, fontSize: 14, lineHeight: 20 },
  taskLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 4,
  },
  taskLinkText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 15,
  },
  section: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.muted,
    marginBottom: 12,
  },
  beforeRowOuter: { marginBottom: 22 },
  beforeRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 4,
  },
  beforeCard: {
    width: 230,
    height: 130,
    borderRadius: radius.md,
    padding: 14,
    justifyContent: 'space-between',
  },
  beforeDark: { backgroundColor: colors.mutedDark },
  beforePink: { backgroundColor: colors.pinkTint },
  beforeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  beforeCardIconImg: {
    width: 48,
    height: 48,
    flexShrink: 0,
  },
  beforeCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  beforeTitle: {
    flex: 1,
    color: colors.onAccent,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  beforeTitlePink: {
    color: colors.text,
  },
  beforeMeta: {
    color: colors.onAccent,
    opacity: 0.85,
    fontSize: 12,
    flexShrink: 1,
  },
  beforeMetaDark: { color: colors.muted, fontSize: 12, flexShrink: 1 },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  seeAllHit: { justifyContent: 'center' },
  seeAll: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 22,
  },
  postCards: {
    gap: 12,
  },
  postCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.card,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  postCardTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  postCardBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  err: { color: colors.danger, marginVertical: 8 },
});
