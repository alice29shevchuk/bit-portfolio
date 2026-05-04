import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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

import type { JsonPlaceholderPost } from '@/api/postsApi';
import {
  postsListQueryKey,
  usePostComments,
  usePostDetail,
} from '@/hooks/usePostsQueries';
import type { MainAppStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

const SCROLL_TOP_FALLBACK = 540;

const POST_DETAIL_HERO = require('../assets/images/post-detail-hero.png');
const CONTENT_GAP_BELOW_HERO = 24;

type Props = NativeStackScreenProps<MainAppStackParamList, 'PostDetail'>;

function capitalizeFirstLetter(text: string): string {
  const s = text.trim();
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PostDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const postId = route.params.postId;
  const queryClient = useQueryClient();
  const [heroHeight, setHeroHeight] = useState(0);
  const listPosts = queryClient.getQueryData<JsonPlaceholderPost[]>(postsListQueryKey);
  const postFromList = listPosts?.find((p) => p.id === postId);

  const detailQuery = usePostDetail(postId);
  const post = detailQuery.data ?? postFromList;

  const commentsQuery = usePostComments(postId);
  const comments = commentsQuery.data ?? [];
  const commentsPending = commentsQuery.isPending && comments.length === 0;
  const commentsShowError = commentsQuery.isError && comments.length === 0;

  const scrollPaddingTop =
    heroHeight > 0 ? heroHeight + CONTENT_GAP_BELOW_HERO : SCROLL_TOP_FALLBACK;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollInner,
          { paddingTop: scrollPaddingTop },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {detailQuery.isError && !post ? (
          <Text style={styles.err}>{t('post.errorLoad')}</Text>
        ) : null}

        {post ? (
          <>
            <Text style={styles.aboutHeading}>{t('post.about')}</Text>
            <View style={styles.aboutCard}>
              <Text style={styles.body}>{capitalizeFirstLetter(post.body)}</Text>
            </View>

            <Text style={styles.commentsHeading}>{t('post.comments')}</Text>
            {commentsPending ? (
              <ActivityIndicator color={colors.accent} style={styles.commentsSpinner} />
            ) : null}
            {commentsShowError ? (
              <Text style={styles.err}>{t('post.commentsLoadError')}</Text>
            ) : null}
            {comments.map((c) => (
              <View key={c.id} style={styles.commentCard}>
                <Text style={styles.cName}>{capitalizeFirstLetter(c.name)}</Text>
                <Text style={styles.cEmail}>{c.email}</Text>
                <Text style={styles.cBody}>{capitalizeFirstLetter(c.body)}</Text>
              </View>
            ))}
          </>
        ) : null}

        <Pressable style={styles.footerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.footerBtnText}>{t('common.back')}</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.heroOverlay} pointerEvents="box-none">
        <View
          style={styles.whiteHero}
          pointerEvents="box-none"
          collapsable={false}
          onLayout={(e) => setHeroHeight(e.nativeEvent.layout.height)}
        >
          <SafeAreaView edges={['top']} style={styles.whiteHeroSafe} pointerEvents="box-none">
            <View style={styles.header} pointerEvents="auto">
              <Pressable hitSlop={12} onPress={() => navigation.goBack()} style={styles.backHit}>
                <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
              </Pressable>
            </View>

            {post ? (
              <View pointerEvents="none">
                <Text style={styles.postTitleText} numberOfLines={5}>
                  {capitalizeFirstLetter(post.title)}
                </Text>
                <Image
                  source={POST_DETAIL_HERO}
                  style={styles.heroImage}
                  contentFit="contain"
                  accessibilityIgnoresInvertColors
                />
              </View>
            ) : detailQuery.isPending ? (
              <View pointerEvents="none" style={styles.heroSpinnerWrap}>
                <ActivityIndicator color={colors.accent} style={styles.heroSpinner} />
              </View>
            ) : null}
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceGray,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    elevation: 8,
  },
  whiteHero: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  whiteHeroSafe: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: -8,
  },
  backHit: { padding: 4 },
  scroll: {
    flex: 1,
    backgroundColor: colors.surfaceGray,
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSpinner: {
    marginTop: 32,
    marginBottom: 16,
  },
  heroSpinnerWrap: {
    alignItems: 'center',
  },
  postTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroImage: {
    width: '100%',
    height: 240,
    borderRadius: radius.lg,
  },
  aboutHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  aboutCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.card,
  },
  body: { fontSize: 16, lineHeight: 24, color: colors.mutedDark },
  commentsHeading: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  commentsSpinner: { marginVertical: 16 },
  commentCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.card,
  },
  cName: { fontWeight: '700', fontSize: 16, color: colors.text },
  cEmail: { fontSize: 12, color: colors.muted, marginTop: 2 },
  cBody: { marginTop: 8, fontSize: 15, lineHeight: 22, color: colors.mutedDark },
  err: { color: colors.danger, marginTop: 16 },
  footerBtn: {
    marginTop: 28,
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  footerBtnText: {
    color: colors.onAccent,
    fontWeight: '700',
    fontSize: 17,
  },
});
