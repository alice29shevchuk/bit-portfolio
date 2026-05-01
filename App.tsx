import '@/i18n';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { AppState, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import i18n from 'i18next';

import { attachAuthInterceptors } from '@/api/authClient';
import RootNavigator from '@/navigation/RootNavigator';
import { queryClient, queryPersister } from '@/query/queryClient';
import { hasStoredPin } from '@/security/pinStorage';
import { store, persistor, type RootState } from '@/store/index';
import { setPinConfigured } from '@/store/authSlice';
import {
  setBootstrapDone,
  setUnlocked,
} from '@/store/sessionSlice';
import { colors } from '@/theme/colors';

void SplashScreen.preventAutoHideAsync();

function LocaleBridge() {
  const locale = useSelector((s: RootState) => s.settings.locale);
  const synced = useRef<string | null>(null);

  useEffect(() => {
    if (synced.current === locale) return;
    synced.current = locale;
    void i18n.changeLanguage(locale);
  }, [locale]);

  return null;
}

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    attachAuthInterceptors(() => store.getState(), store.dispatch);
    void (async () => {
      try {
        const state = store.getState();
        const keyPin = await hasStoredPin();
        if (state.auth.pinConfigured && !keyPin) {
          dispatch(setPinConfigured(false));
        } else if (
          !state.auth.pinConfigured &&
          keyPin &&
          state.auth.accessToken
        ) {
          dispatch(setPinConfigured(true));
        }
      } finally {
        dispatch(setBootstrapDone(true));
        await SplashScreen.hideAsync();
      }
    })();
  }, [dispatch]);

  return <>{children}</>;
}

function SessionLock() {
  const dispatch = useDispatch();
  const hasAuth = useSelector((s: RootState) => !!s.auth.accessToken);
  const pinOk = useSelector((s: RootState) => s.auth.pinConfigured);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'background' || next === 'inactive') {
        if (hasAuth && pinOk) dispatch(setUnlocked(false));
      }
    });
    return () => sub.remove();
  }, [dispatch, hasAuth, pinOk]);

  return null;
}

function NavigationRoot() {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  const pinConfigured = useSelector((s: RootState) => s.auth.pinConfigured);
  const unlocked = useSelector((s: RootState) => s.session.unlocked);
  const bootstrapDone = useSelector((s: RootState) => s.session.bootstrapDone);

  if (!bootstrapDone) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  return (
    <>
      <SessionLock />
      <RootNavigator
        token={token}
        pinConfigured={pinConfigured}
        unlocked={unlocked}
      />
    </>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
    notification: colors.accent,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{
                persister: queryPersister,
                maxAge: 1000 * 60 * 60 * 24 * 14,
              }}
            >
              <AuthBootstrap>
                <LocaleBridge />
                <NavigationContainer theme={navTheme}>
                  <StatusBar style="dark" />
                  <NavigationRoot />
                </NavigationContainer>
              </AuthBootstrap>
            </PersistQueryClientProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
