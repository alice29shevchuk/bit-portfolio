import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PinDots from '@/components/PinDots';
import PinKeypad from '@/components/PinKeypad';
import { PIN_LENGTH } from '@/constants/pin';
import type { RootStackParamList } from '@/navigation/types';
import { queryClient } from '@/query/queryClient';
import { clearStoredPin, verifyPin } from '@/security/pinStorage';
import type { RootState } from '@/store/index';
import { logout } from '@/store/authSlice';
import { setBiometricsEnabled } from '@/store/settingsSlice';
import { resetSession, setUnlocked } from '@/store/sessionSlice';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { authenticateBiometricDetailed } from '@/utils/biometrics';

const SILENT_BIOMETRIC_ERRORS = new Set([
  'user_cancel',
  'system_cancel',
  'app_cancel',
]);

type Props = NativeStackScreenProps<RootStackParamList, 'Unlock'>;

export default function UnlockScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const [entry, setEntry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const autoBioAttempted = useRef(false);

  const changeAccount = useCallback(() => {
    Alert.alert(t('unlock.changeAccount'), t('unlock.changeAccountConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('unlock.changeAccount'),
        style: 'destructive',
        onPress: () => {
          void clearStoredPin().finally(() => {
            dispatch(logout());
            dispatch(resetSession());
            dispatch(setUnlocked(false));
            queryClient.clear();
          });
        },
      },
    ]);
  }, [dispatch, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <Pressable onPress={changeAccount} hitSlop={12}>
          <Text style={styles.change}>{t('unlock.changeAccount')}</Text>
        </Pressable>
      ),
    });
  }, [navigation, changeAccount, t]);

  const emailLine = user?.email ?? user?.username ?? '';

  const append = (d: string) => {
    setError(null);
    if (entry.length >= PIN_LENGTH) return;
    setEntry((e) => e + d);
  };

  const del = () => {
    setError(null);
    setEntry((e) => e.slice(0, -1));
  };

  const submitPin = async () => {
    setError(null);
    if (entry.length !== PIN_LENGTH) {
      setError(t('validation.pinDigits'));
      return;
    }
    const ok = await verifyPin(entry);
    if (ok) dispatch(setUnlocked(true));
    else setError(t('pin.wrongPin'));
  };

  const tryBiometric = useCallback(async () => {
    setError(null);
    await new Promise<void>((resolve) => {
      InteractionManager.runAfterInteractions(() => resolve());
    });

    const { success, error: bioError } = await authenticateBiometricDetailed(
      t('biometric.promptUnlock'),
      { cancelLabel: t('common.cancel') },
    );

    if (success) {
      dispatch(setBiometricsEnabled(true));
      dispatch(setUnlocked(true));
      return;
    }

    if (bioError && SILENT_BIOMETRIC_ERRORS.has(bioError)) return;

    if (bioError === 'not_enrolled') {
      setError(t('settings.biometricUnavailable'));
      return;
    }

    setError(t('biometric.unlockFailed'));
  }, [dispatch, t]);

  useEffect(() => {
    if (autoBioAttempted.current) return;
    autoBioAttempted.current = true;
    const id = setTimeout(() => {
      void tryBiometric();
    }, 450);
    return () => clearTimeout(id);
  }, [tryBiometric]);

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      style={styles.flex}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.email}>{emailLine}</Text>
      <Text style={styles.instruction}>
        {t('pin.enterDigitsShort', { n: PIN_LENGTH })}
      </Text>
      <PinDots length={PIN_LENGTH} filled={entry.length} />
      <PinKeypad onDigit={append} onDelete={del} />
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <Pressable style={styles.primaryBtn} onPress={() => void submitPin()}>
        <Text style={styles.primaryBtnText}>{t('common.continue')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  change: { color: colors.accent, fontWeight: '700', fontSize: 15 },
  email: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  instruction: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  err: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  primaryBtn: {
    marginTop: 28,
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
