import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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

import { usePostDetail } from '@/hooks/usePostsQueries';
import type { MainAppStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = NativeStackScreenProps<MainAppStackParamList, 'PostDetail'>;

const MOCK_COMMENTS = [
  {
    key: '1',
    name: 'Igor',
    email: 'igor@example.com',
    bodyKey: 'post.mockComment1',
  },
  {
    key: '2',
    name: 'Anna',
    email: 'anna@example.com',
    bodyKey: 'post.mockComment2',
  },
  {
    key: '3',
    name: 'Chris',
    email: 'chris@example.com',
    bodyKey: 'post.mockComment3',
  },
] as const;

export default function PostDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const postId = route.params.postId;
  const { data, isPending, isError } = usePostDetail(postId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()} style={styles.backHit}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {data?.title ?? t('post.title')}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} style={styles.flex}>
        {isPending ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 32 }} />
        ) : null}
        {isError ? (
          <Text style={styles.err}>{t('post.errorLoad')}</Text>
        ) : null}

        {data ? (
          <>
            <View style={styles.heroImg}>
              <MaterialCommunityIcons
                name="book-open-variant"
                size={72}
                color={colors.accent}
              />
            </View>

            <Text style={styles.aboutHeading}>{t('post.about')}</Text>
            <Text style={styles.body}>{data.body}</Text>

            <Text style={styles.commentsHeading}>{t('post.comments')}</Text>
            {MOCK_COMMENTS.map((c) => (
              <View key={c.key} style={styles.commentCard}>
                <Text style={styles.cName}>{c.name}</Text>
                <Text style={styles.cEmail}>{c.email}</Text>
                <Text style={styles.cBody}>{t(c.bodyKey)}</Text>
              </View>
            ))}
          </>
        ) : null}

        <Pressable style={styles.footerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.footerBtnText}>{t('common.back')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backHit: { padding: 4 },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroImg: {
    marginTop: 20,
    marginBottom: 24,
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  aboutHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  body: { fontSize: 16, lineHeight: 24, color: colors.mutedDark },
  commentsHeading: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  commentCard: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
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
