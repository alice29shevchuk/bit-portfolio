import * as SecureStore from 'expo-secure-store';
import * as Keychain from 'react-native-keychain';

const PIN_SERVICE = 'com.bitportfolio.userpin';

const SECURE_STORE_PIN_KEY = 'bitportfolio.pin.v1';

async function saveWithKeychain(pin: string): Promise<boolean> {
  try {
    await Keychain.setGenericPassword('pinholder', pin, {
      service: PIN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
    return true;
  } catch {
    try {
      await Keychain.setGenericPassword('pinholder', pin, {
        service: PIN_SERVICE,
      });
      return true;
    } catch {
      return false;
    }
  }
}

export async function savePin(pin: string): Promise<void> {
  if (await saveWithKeychain(pin)) {
    await SecureStore.deleteItemAsync(SECURE_STORE_PIN_KEY).catch(() => undefined);
    return;
  }

  await SecureStore.setItemAsync(SECURE_STORE_PIN_KEY, pin, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function verifyPin(pin: string): Promise<boolean> {
  try {
    const kc = await Keychain.getGenericPassword({ service: PIN_SERVICE });
    if (kc !== false && kc.password === pin) return true;
  } catch {}

  try {
    const stored = await SecureStore.getItemAsync(SECURE_STORE_PIN_KEY);
    return stored === pin;
  } catch {
    return false;
  }
}

export async function hasStoredPin(): Promise<boolean> {
  try {
    const kc = await Keychain.getGenericPassword({ service: PIN_SERVICE });
    if (kc !== false) return true;
  } catch {}

  try {
    const stored = await SecureStore.getItemAsync(SECURE_STORE_PIN_KEY);
    return stored != null && stored.length > 0;
  } catch {
    return false;
  }
}

export async function clearStoredPin(): Promise<void> {
  await Keychain.resetGenericPassword({ service: PIN_SERVICE }).catch(
    () => undefined,
  );
  await SecureStore.deleteItemAsync(SECURE_STORE_PIN_KEY).catch(() => undefined);
}
