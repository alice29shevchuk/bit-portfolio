import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { JsonPlaceholderPost } from '@/api/postsApi';
import { useAllPosts } from '@/hooks/usePostsQueries';
import type {
  MainAppStackParamList,
  MainTabParamList,
} from '@/navigation/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'SearchTab'>,
  NativeStackScreenProps<MainAppStackParamList>
>;

export default function SearchScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const { data, isPending, isError } = useAllPosts();

  const filtered = useMemo(() => {
    const list = data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.body.toLowerCase().includes(needle),
    );
  }, [data, q]);

  const renderItem = ({ item }: { item: JsonPlaceholderPost }) => (
    <Pressable
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      style={styles.card}
    >
      <Text style={styles.idLine}>
        <Text style={styles.idBold}>ID: </Text>
        {item.id}
      </Text>
      <Text style={styles.nameLine} numberOfLines={2}>
        <Text style={styles.nameBold}>{t('search.nameLabel')} </Text>
        {item.title}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.screenTitle}>{t('tabs.search')}</Text>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={22} color={colors.muted} />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={setQ}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={q}
        />
      </View>

      {isPending ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />
      ) : null}
      {isError ? (
        <Text style={styles.err}>{t('post.errorLoad')}</Text>
      ) : null}

      {!isPending && filtered.length === 0 ? (
        <Text style={styles.empty}>{t('common.noResults')}</Text>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 6 },
  list: { paddingHorizontal: 22, paddingBottom: 32 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  idLine: { fontSize: 15, color: colors.muted, marginBottom: 8 },
  idBold: { fontWeight: '700', color: colors.text },
  nameLine: { fontSize: 15, color: colors.muted, lineHeight: 22 },
  nameBold: { fontWeight: '700', color: colors.text },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24 },
  err: { color: colors.danger, textAlign: 'center', marginTop: 12 },
});
