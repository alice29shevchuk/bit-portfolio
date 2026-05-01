import { zodResolver } from '@hookform/resolvers/zod';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
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

import AuthFormHeader from '@/components/AuthFormHeader';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { registerSchema, type RegisterFormValues } from '@/utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [showPw, setShowPw] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(() => {
    Alert.alert(t('auth.afterRegisterTitle'), t('auth.afterRegisterMessage'), [
      {
        text: t('common.continue'),
        onPress: () => navigation.navigate('Login'),
      },
    ]);
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <AuthFormHeader
          title={t('auth.registerTitle')}
          subtitle={t('auth.personalAccount')}
        />

        <Text style={styles.label}>{t('auth.name')}</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t('auth.name')}
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={value}
            />
          )}
        />
        {errors.name ? (
          <Text style={styles.err}>{t('validation.nameRequired')}</Text>
        ) : null}

        <Text style={styles.label}>{t('auth.email')}</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="emma-watson@m.com"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={value}
            />
          )}
        />
        {errors.email ? (
          <Text style={styles.err}>{t('validation.emailInvalid')}</Text>
        ) : null}

        <Text style={styles.label}>{t('auth.password')}</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputRow}>
              <TextInput
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
          <Text style={styles.err}>{t('validation.passwordRules')}</Text>
        ) : (
          <Text style={styles.hint}>{t('validation.passwordRules')}</Text>
        )}

        <Pressable onPress={onSubmit} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>{t('common.continue')}</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={styles.secondaryBtn}
        >
          <Text style={styles.secondaryBtnText}>{t('auth.goLogin')}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 48,
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
  err: { color: colors.danger, marginBottom: 12, fontSize: 13 },
  hint: { color: colors.muted, marginBottom: 18, fontSize: 13 },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryBtnText: {
    color: colors.onAccent,
    fontWeight: '700',
    fontSize: 17,
  },
  secondaryBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 15,
  },
});
