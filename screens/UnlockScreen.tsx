import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const HEADER_ART = require('../assets/images/login-form-header.svg');

const FORM_HORIZONTAL_PADDING = 22;

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

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
    <SafeAreaView style={styles.safeOuter} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        style={styles.scrollFlex}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBlock}>
          <Image
            source={HEADER_ART}
            style={styles.headerIcon}
            contentFit="contain"
          />
          <Text style={styles.email}>{emailLine}</Text>
          <Pressable
            onPress={changeAccount}
            hitSlop={12}
            accessibilityRole="button"
          >
            <Text style={styles.changeAccountLink}>
              {t('unlock.changeAccount')}
            </Text>
          </Pressable>
          <Text style={styles.instruction}>
            {t('pin.enterDigitsShort', { n: PIN_LENGTH })}
          </Text>
          <PinDots
            length={PIN_LENGTH}
            filled={entry.length}
            style={styles.pinDots}
          />
        </View>

        <View style={styles.bottomBlock}>
          {error ? <Text style={styles.err}>{error}</Text> : null}
          <View style={[styles.separator, styles.separatorAboveKeypad]} />
          <PinKeypad onDigit={append} onDelete={del} />
          <View style={[styles.separator, styles.separatorAboveContinue]} />
          <Pressable style={styles.primaryBtn} onPress={() => void submitPin()}>
            <Text style={styles.primaryBtnText}>{t('common.continue')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeOuter: { flex: 1, backgroundColor: colors.bg },
  scrollFlex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: FORM_HORIZONTAL_PADDING,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topBlock: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 49,
    height: 49,
    marginBottom: 16,
  },
  email: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  changeAccountLink: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 52,
  },
  instruction: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
    marginBottom: 10,
  },
  pinDots: {
    marginTop: 0,
  },
  bottomBlock: {
    marginTop: 'auto',
    paddingTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.separator,
    marginHorizontal: -FORM_HORIZONTAL_PADDING,
  },
  separatorAboveKeypad: {
    marginTop: 8,
    marginBottom: 16,
  },
  separatorAboveContinue: {
    marginTop: 16,
    marginBottom: 20,
  },
  err: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 12,
  },
  primaryBtn: {
    marginTop: 0,
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
