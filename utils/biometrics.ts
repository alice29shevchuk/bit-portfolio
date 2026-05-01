import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export function biometricPromptOptions(cancelLabel: string) {
  return {
    cancelLabel,
    disableDeviceFallback: true as const,
    ...(Platform.OS === 'ios' ? ({ fallbackLabel: '' } as const) : {}),
  };
}

export async function biometricHardwareReady(): Promise<boolean> {
  try {
    return await LocalAuthentication.isEnrolledAsync();
  } catch {
    return false;
  }
}

type AuthenticateOpts = {
  cancelLabel?: string;
};

export type BiometricAuthResult = {
  success: boolean;
  error?: string;
};

export async function authenticateBiometricDetailed(
  promptMessage: string,
  opts?: AuthenticateOpts,
): Promise<BiometricAuthResult> {
  try {
    const r = await LocalAuthentication.authenticateAsync({
      promptMessage,
      ...biometricPromptOptions(opts?.cancelLabel ?? 'Cancel'),
    });
    if (r.success) return { success: true };
    const error = 'error' in r ? r.error : undefined;
    return { success: false, error };
  } catch {
    return { success: false, error: 'unknown' };
  }
}

export async function authenticateBiometric(
  promptMessage: string,
  opts?: AuthenticateOpts,
): Promise<boolean> {
  const r = await authenticateBiometricDetailed(promptMessage, opts);
  return r.success;
}
