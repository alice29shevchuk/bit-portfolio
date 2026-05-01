import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as LocalAuthentication from 'expo-local-authentication';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useDispatch } from 'react-redux';

import PinDots from '@/components/PinDots';
import PinKeypad from '@/components/PinKeypad';
import { PIN_LENGTH } from '@/constants/pin';
import type { RootStackParamList } from '@/navigation/types';
import { savePin } from '@/security/pinStorage';
import type { AppDispatch } from '@/store/index';
import { setBiometricsEnabled } from '@/store/settingsSlice';
import { setPinConfigured } from '@/store/authSlice';
import { setUnlocked } from '@/store/sessionSlice';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { biometricPromptOptions } from '@/utils/biometrics';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePin'>;

async function offerSystemBiometricEnrollment(
  t: (key: string) => string,
  dispatch: AppDispatch,
): Promise<void> {
  try {
    await new Promise<void>((resolve) => {
      InteractionManager.runAfterInteractions(() => resolve());
    });
    await new Promise<void>((r) => setTimeout(r, 200));

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t('biometric.systemEnrollmentPrompt'),
      ...biometricPromptOptions(t('common.cancel')),
    });

    dispatch(setBiometricsEnabled(result.success));
  } catch {}
}

export default function CreatePinScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState<'first' | 'repeat'>('first');
  const [firstPin, setFirstPin] = useState('');
  const [entry, setEntry] = useState('');
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        step === 'first' ? t('pin.createTitleLong') : t('pin.repeatTitleLong'),
      headerBackVisible: step === 'repeat',
    });
  }, [navigation, step, t]);

  const append = (d: string) => {
    setError(null);
    if (entry.length >= PIN_LENGTH) return;
    setEntry((e) => e + d);
  };

  const del = () => {
    setError(null);
    setEntry((e) => e.slice(0, -1));
  };

  const onContinue = async () => {
    setError(null);
    if (entry.length !== PIN_LENGTH) {
      setError(t('validation.pinDigits'));
      return;
    }
    if (step === 'first') {
      setFirstPin(entry);
      setEntry('');
      setStep('repeat');
      return;
    }
    if (entry !== firstPin) {
      setError(t('validation.pinMatch'));
      return;
    }

    try {
      await savePin(entry);
    } catch {
      setError(t('pin.saveError'));
      return;
    }

    await offerSystemBiometricEnrollment(t, dispatch);

    dispatch(setPinConfigured(true));
    dispatch(setUnlocked(true));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      style={styles.flex}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.instruction}>{t('pin.enterDigits', { n: PIN_LENGTH })}</Text>
      <PinDots length={PIN_LENGTH} filled={entry.length} />
      <PinKeypad onDigit={append} onDelete={del} />
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <Pressable style={styles.primaryBtn} onPress={() => void onContinue()}>
        <Text style={styles.primaryBtnText}>{t('common.continue')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
  },
  instruction: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
    marginBottom: 8,
  },
  err: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
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
