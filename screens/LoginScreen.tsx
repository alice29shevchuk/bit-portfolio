import { zodResolver } from '@hookform/resolvers/zod';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import AuthFormHeader from '@/components/AuthFormHeader';
import { loginRequest } from '@/api/authService';
import type { RootStackParamList } from '@/navigation/types';
import { setCredentials } from '@/store/authSlice';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            hitSlop={12}
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={30}
              color={colors.text}
            />
          </Pressable>

          <AuthFormHeader
            title={t('auth.loginTitle')}
            subtitle={t('auth.personalAccount')}
          />

          {formError ? <Text style={styles.banner}>{formError}</Text> : null}

          <Text style={styles.label}>{t('auth.loginUsernameLabel')}</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={!busy}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="emilys"
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={value}
              />
            )}
          />
          {errors.username ? (
            <Text style={styles.err}>{errors.username.message}</Text>
          ) : null}
          <Text style={styles.fieldHelp}>{t('auth.loginUsernameHelp')}</Text>

          <Text style={styles.label}>{t('auth.password')}</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputRow}>
                <TextInput
                  editable={!busy}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder={t('auth.passwordPlaceholder')}
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPw}
                  style={[styles.input, styles.inputFlex]}
                  value={value}
                />
                <Pressable
                  onPress={() => setShowPw((s) => !s)}
                  style={styles.eye}
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons
                    name={showPw ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
            )}
          />
          {errors.password ? (
            <Text style={styles.err}>{errors.password.message}</Text>
          ) : null}

          <Text style={styles.mini}>{t('auth.passwordHintDummy')}</Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  back: { alignSelf: 'flex-start', paddingVertical: 6, marginBottom: 8 },
  banner: {
    backgroundColor: colors.pinkTint,
    color: colors.danger,
    padding: 12,
    borderRadius: radius.sm,
    marginBottom: 16,
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    color: colors.text,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.cardMuted,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.cardMuted,
    marginBottom: 6,
    paddingRight: 10,
  },
  inputFlex: { flex: 1, borderWidth: 0, marginBottom: 0, backgroundColor: 'transparent' },
  eye: { padding: 8 },
  err: { color: colors.danger, marginBottom: 10, fontSize: 13 },
  fieldHelp: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    marginTop: 2,
  },
  mini: { color: colors.muted, fontSize: 13, marginBottom: 22 },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: 8,
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
