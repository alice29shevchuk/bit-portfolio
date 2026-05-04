import { zodResolver } from '@hookform/resolvers/zod';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import AuthFormHeader from '@/components/AuthFormHeader';
import AuthSheetChrome from '@/components/AuthSheetChrome';
import { loginRequest } from '@/api/authService';
import type { RootStackParamList } from '@/navigation/types';
import { setCredentials } from '@/store/authSlice';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

const LOGIN_HEADER_ART = require('../assets/images/login-form-header.svg');

const FORM_HORIZONTAL_PADDING = 22;

function FieldErrorHintIcon() {
  return (
    <MaterialCommunityIcons
      name="information-outline"
      size={18}
      color={colors.danger}
      style={styles.fieldErrorIcon}
    />
  );
}

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof loginSchema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setBusy(true);
    setFormError(null);
    try {
      const res = await loginRequest(values.username, values.password);
      dispatch(
        setCredentials({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
        }),
      );
    } catch {
      setFormError(t('auth.invalidCredentials'));
    } finally {
      setBusy(false);
    }
  });

  return (
    <AuthSheetChrome onBack={() => navigation.goBack()}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <AuthFormHeader
            title={t('auth.loginTitle')}
            subtitle={t('auth.personalAccount')}
            leadingImage={LOGIN_HEADER_ART}
          />

          <View style={styles.separator} />

          {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}

          <Text style={styles.label}>{t('auth.email')}</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={[styles.inputRow, formError && styles.inputRowBorderError]}
              >
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!busy}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    setFormError(null);
                    onChange(text);
                  }}
                  placeholder="emilys"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, styles.inputFlex]}
                  value={value}
                />
                {formError ? <FieldErrorHintIcon /> : null}
              </View>
            )}
          />
          {errors.username ? (
            <Text style={styles.err}>{errors.username.message}</Text>
          ) : null}

          <View style={[styles.passwordLabelRow, styles.labelAfterField]}>
            <Text style={styles.labelFlat}>{t('auth.password')}</Text>
            <Pressable
              hitSlop={10}
              accessibilityRole="button"
              onPress={() =>
                Alert.alert(t('auth.forgotPassword'), t('auth.forgotPasswordHint'))
              }
            >
              <Text style={styles.forgotLink}>{t('auth.forgotPassword')}</Text>
            </Pressable>
          </View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={[styles.inputRow, formError && styles.inputRowBorderError]}
              >
                <TextInput
                  editable={!busy}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    setFormError(null);
                    onChange(text);
                  }}
                  placeholder={t('auth.passwordPlaceholder')}
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPw}
                  style={[styles.input, styles.inputFlex]}
                  value={value}
                />
                {formError ? <FieldErrorHintIcon /> : null}
                <Pressable
                  onPress={() => setShowPw((s) => !s)}
                  style={styles.eye}
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons
                    name={showPw ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.accent}
                  />
                </Pressable>
              </View>
            )}
          />
          {errors.password ? (
            <Text style={styles.err}>{errors.password.message}</Text>
          ) : null}

          <Pressable
            disabled={busy}
            onPress={onSubmit}
            style={[styles.primaryBtn, busy && styles.disabled]}
          >
            {busy ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <Text style={styles.primaryBtnText}>{t('common.continue')}</Text>
            )}
          </Pressable>

          <Pressable
            disabled={busy}
            onPress={() => navigation.navigate('Register')}
            style={styles.secondaryBtn}
          >
            <Text style={styles.secondaryBtnText}>{t('auth.goRegister')}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthSheetChrome>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: FORM_HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 40,
  },
  separator: {
    height: 1,
    backgroundColor: colors.separator,
    marginHorizontal: -FORM_HORIZONTAL_PADDING,
    marginBottom: 16,
  },
  formErrorText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  label: {
    color: colors.mutedDark,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  labelAfterField: {
    marginTop: 16,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  labelFlat: {
    color: colors.mutedDark,
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
  forgotLink: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  fieldErrorIcon: {
    marginRight: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    marginBottom: 4,
    paddingRight: 10,
  },
  inputRowBorderError: {
    borderColor: colors.danger,
  },
  inputFlex: { flex: 1, borderWidth: 0, marginBottom: 0, backgroundColor: 'transparent' },
  eye: { padding: 8 },
  err: { color: colors.danger, marginBottom: 8, fontSize: 13 },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: 24,
  },
  disabled: { opacity: 0.75 },
  primaryBtnText: {
    color: colors.onAccent,
    fontWeight: '700',
    fontSize: 17,
  },
  secondaryBtn: {
    marginTop: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 15,
  },
});
