import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import PinDots from '@/components/PinDots';
import PinKeypad from '@/components/PinKeypad';
import { PIN_LENGTH } from '@/constants/pin';
import type { RootStackParamList } from '@/navigation/types';
import { savePin } from '@/security/pinStorage';
import type { AppDispatch } from '@/store/index';
import { setBiometricsEnabled } from '@/store/settingsSlice';
import { logout, setPinConfigured } from '@/store/authSlice';
import { setUnlocked } from '@/store/sessionSlice';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { biometricPromptOptions } from '@/utils/biometrics';

const PIN_SETUP_ICON = require('../assets/images/pin-setup-icon.svg');

/** Как на Login — full-bleed сепараторы. */
const FORM_HORIZONTAL_PADDING = 22;

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePin'>;

/** Ключи i18n: «PINs must match» показываем над верхним сепаратором. */
type CreatePinErrorKey =
  | 'validation.pinDigits'
  | 'validation.pinMatch'
  | 'pin.saveError';

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
  } catch { }
}

export default function CreatePinScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState<'first' | 'repeat'>('first');
  const [firstPin, setFirstPin] = useState('');
  const [entry, setEntry] = useState('');
  const [errorKey, setErrorKey] = useState<CreatePinErrorKey | null>(null);

  const handleBack = useCallback(() => {
    setErrorKey(null);
    if (step === 'repeat') {
      setStep('first');
      setFirstPin('');
      setEntry('');
      return;
    }
    dispatch(logout());
  }, [dispatch, step]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          hitSlop={12}
          onPress={handleBack}
          style={styles.headerBackBtn}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={30}
            color={colors.text}
          />
        </Pressable>
      ),
    });
  }, [navigation, handleBack]);

  const append = (d: string) => {
    setErrorKey(null);
    if (entry.length >= PIN_LENGTH) return;
    setEntry((e) => e + d);
  };

  const del = () => {
    setErrorKey(null);
    setEntry((e) => e.slice(0, -1));
  };

  const onContinue = async () => {
    setErrorKey(null);
    if (entry.length !== PIN_LENGTH) {
      setErrorKey('validation.pinDigits');
      return;
    }
    if (step === 'first') {
      setFirstPin(entry);
      setEntry('');
      setStep('repeat');
      return;
    }
    if (entry !== firstPin) {
      setErrorKey('validation.pinMatch');
      return;
    }

    try {
      await savePin(entry);
    } catch {
      setErrorKey('pin.saveError');
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
      <View style={styles.topBlock}>
        <Image
          source={PIN_SETUP_ICON}
          style={styles.pinIcon}
          contentFit="contain"
        />
        <Text style={styles.screenTitle}>
          {step === 'first' ? t('pin.createTitleLong') : t('pin.repeatTitleLong')}
        </Text>
        <Text style={styles.instruction}>{t('pin.enterDigits', { n: PIN_LENGTH })}</Text>
        <PinDots length={PIN_LENGTH} filled={entry.length} />
      </View>

      <View style={styles.bottomBlock}>
        {errorKey === 'validation.pinMatch' ? (
          <Text style={styles.errAboveSeparator}>{t(errorKey)}</Text>
        ) : null}
        <View style={[styles.separator, styles.separatorAboveKeypad]} />
        <PinKeypad onDigit={append} onDelete={del} />
        {errorKey && errorKey !== 'validation.pinMatch' ? (
          <Text style={styles.err}>{t(errorKey)}</Text>
        ) : null}
        <View style={[styles.separator, styles.separatorAboveContinue]} />
        <Pressable style={styles.primaryBtn} onPress={() => void onContinue()}>
          <Text style={styles.primaryBtnText}>{t('common.continue')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  headerBackBtn: {
    marginLeft: 4,
    paddingVertical: 4,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: FORM_HORIZONTAL_PADDING,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topBlock: {
    alignItems: 'center',
  },
  pinIcon: {
    width: 49,
    height: 49,
    marginBottom: 16,
  },
  screenTitle: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 52,
    paddingHorizontal: 8,
  },
  instruction: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
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
    marginTop: 4,
    marginBottom: 16,
  },
  errAboveSeparator: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
    paddingHorizontal: 8,
  },
  separatorAboveContinue: {
    marginTop: 16,
    marginBottom: 20,
  },
  err: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
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
