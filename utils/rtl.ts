import { DevSettings, I18nManager } from 'react-native';

import { persistor } from '@/store/index';
import type { LocaleCode } from '@/store/settingsSlice';

export async function syncRtlWithLocale(locale: LocaleCode): Promise<void> {
  const wantRtl = locale === 'ar';
  if (I18nManager.isRTL === wantRtl) return;
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(wantRtl);
  await persistor.flush();
  DevSettings.reload();
}
