import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type LocaleCode = 'en' | 'ar';

export type SettingsState = {
  locale: LocaleCode;
  biometricsEnabled: boolean;
  avatarUri: string | null;
  displayNameOverride: string | null;
};

const initialState: SettingsState = {
  locale: 'en',
  biometricsEnabled: true,
  avatarUri: null,
  displayNameOverride: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<LocaleCode>) {
      state.locale = action.payload;
    },
    setBiometricsEnabled(state, action: PayloadAction<boolean>) {
      state.biometricsEnabled = action.payload;
    },
    setAvatarUri(state, action: PayloadAction<string | null>) {
      state.avatarUri = action.payload;
    },
    setDisplayNameOverride(state, action: PayloadAction<string | null>) {
      state.displayNameOverride = action.payload;
    },
    resetSettings(state) {
      state.locale = 'en';
      state.biometricsEnabled = false;
      state.avatarUri = null;
      state.displayNameOverride = null;
    },
    clearSessionPreferences(state) {
      state.biometricsEnabled = true;
      state.avatarUri = null;
      state.displayNameOverride = null;
    },
  },
});

export const {
  setLocale,
  setBiometricsEnabled,
  setAvatarUri,
  setDisplayNameOverride,
  resetSettings,
  clearSessionPreferences,
} = settingsSlice.actions;

export default settingsSlice.reducer;
