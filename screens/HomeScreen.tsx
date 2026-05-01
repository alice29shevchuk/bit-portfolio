import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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

        <Text style={styles.section}>{t('home.beforeStart')}</Text>
        <View style={styles.beforeRow}>
          <View style={[styles.beforeCard, styles.beforeDark]}>
            <MaterialCommunityIcons
              name="link-variant"
              size={22}
              color={colors.accent}
            />
            <Text style={styles.beforeTitle}>{t('home.linkBank')}</Text>
            <Text style={styles.beforeMeta}>{t('home.steps', { n: 2 })}</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={colors.onAccent}
              style={styles.beforeChevron}
            />
          </View>
          <View style={[styles.beforeCard, styles.beforePink]}>
            <MaterialCommunityIcons
              name="wallet-outline"
              size={22}
              color={colors.danger}
            />
            <Text style={[styles.beforeTitle, { color: colors.text }]}>
              {t('home.addWallet')}
            </Text>
            <Text style={styles.beforeMetaDark}>{t('home.steps', { n: 3 })}</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={colors.muted}
              style={styles.beforeChevron}
            />
          </View>
        </View>

        <View style={styles.postsHeader}>
          <Text style={styles.section}>{t('home.posts')}</Text>
          <Pressable onPress={() => navigation.navigate('SearchTab')}>
            <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
          </Pressable>
        </View>

        {isPending ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 16 }} />
        ) : null}
        {isError ? (
          <Text style={styles.err}>{t('post.errorLoad')}</Text>
        ) : null}

        <View style={styles.postList}>
          {(data ?? []).map((post, idx, arr) => (
            <Pressable
              key={post.id}
              onPress={() => openPost(post.id)}
              style={[
                styles.postRow,
                idx < arr.length - 1 && styles.postRowBorder,
              ]}
            >
              <Text style={styles.postTitle} numberOfLines={2}>
                {post.title}
              </Text>
              <Text style={styles.postBody} numberOfLines={3}>
                {post.body}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  heroSafe: { paddingHorizontal: 22 },
  heroSmall: {
    color: colors.onAccent,
    opacity: 0.95,
    fontSize: 15,
    fontWeight: '600',
  },
  heroName: {
    color: colors.onAccent,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  scroll: { flex: 1, marginTop: -12 },
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
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  beforeRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  beforeCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: 14,
    minHeight: 110,
    justifyContent: 'flex-start',
  },
  beforeDark: { backgroundColor: colors.mutedDark },
  beforePink: { backgroundColor: colors.pinkTint },
  beforeTitle: {
    color: colors.onAccent,
    fontWeight: '700',
    fontSize: 14,
    marginTop: 10,
  },
  beforeMeta: { color: colors.onAccent, opacity: 0.85, marginTop: 6, fontSize: 12 },
  beforeMetaDark: { color: colors.muted, marginTop: 6, fontSize: 12 },
  beforeChevron: { position: 'absolute', right: 10, bottom: 10 },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  seeAll: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  postList: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  postRow: { paddingVertical: 14, paddingHorizontal: 16 },
  postRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  postTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  postBody: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  err: { color: colors.danger, marginVertical: 8 },
});
