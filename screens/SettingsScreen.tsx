import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { authApi } from '@/api/authClient';
import { mapDummyUser } from '@/api/authService';
import type { ProfileStackParamList } from '@/navigation/types';
import { queryClient } from '@/query/queryClient';
import { clearStoredPin } from '@/security/pinStorage';
import type { RootState } from '@/store/index';
import { logout, updateUser } from '@/store/authSlice';
import { clearSessionPreferences, setAvatarUri } from '@/store/settingsSlice';
import { resetSession, setUnlocked } from '@/store/sessionSlice';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { resolveDisplayName } from '@/utils/displayName';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsMain'>;

function avatarSource(uri: string | null, remote?: string) {
  if (uri) return { uri } as const;
  if (remote) return { uri: remote } as const;
  return null;
}

export default function SettingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const settings = useSelector((s: RootState) => s.settings);
  const displayName = resolveDisplayName(user, settings.displayNameOverride);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        try {
          const { data } = await authApi.get('/auth/me');
          dispatch(updateUser(mapDummyUser(data as Record<string, unknown>)));
        } catch {}
      })();
    }, [dispatch]),
  );

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t('settings.permissionDenied'));
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]) {
      dispatch(setAvatarUri(res.assets[0].uri));
    }
  };

  const handleLogout = () => {
    Alert.alert(t('settings.logout'), t('settings.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'),
        style: 'destructive',
        onPress: () => {
          void clearStoredPin().finally(() => {
            dispatch(logout());
            dispatch(resetSession());
            dispatch(clearSessionPreferences());
            dispatch(setUnlocked(false));
            queryClient.clear();
          });
        },
      },
    ]);
  };

  const src = avatarSource(settings.avatarUri, user?.image);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>{t('settings.title')}</Text>

        <Pressable style={styles.profileCard} onPress={() => void pickImage()}>
          {src ? (
            <Image source={src} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPh]}>
              <MaterialCommunityIcons name="account" size={36} color={colors.muted} />
            </View>
          )}
          <Text style={styles.profileName}>{displayName || '—'}</Text>
        </Pressable>

        <Text style={styles.section}>{t('settings.basicSection')}</Text>
        <Pressable
          style={styles.menuCard}
          onPress={() => navigation.navigate('Language')}
        >
          <MaterialCommunityIcons name="earth" size={22} color={colors.accent} />
          <Text style={styles.rowLabel}>{t('settings.language')}</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
        </Pressable>

        <Text style={styles.section}>{t('settings.otherSection')}</Text>
        <Pressable style={styles.menuCard} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout-variant" size={22} color={colors.accent} />
          <Text style={styles.rowLabel}>{t('settings.logout')}</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 40 },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: 22,
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    marginBottom: 28,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
  },
  avatarPh: { alignItems: 'center', justifyContent: 'center' },
  profileName: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.text },
  section: {
    paddingHorizontal: 22,
    marginBottom: 10,
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 0.3,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    marginBottom: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  rowLabel: { flex: 1, fontSize: 17, fontWeight: '600', color: colors.text },
});
