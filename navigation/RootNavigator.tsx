import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreatePinScreen from '@/screens/CreatePinScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import SplashScreen from '@/screens/SplashScreen';
import UnlockScreen from '@/screens/UnlockScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import { colors } from '@/theme/colors';

import MainAppNavigator from './MainAppNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  token: string | null;
  pinConfigured: boolean;
  unlocked: boolean;
};

const authScreenOptions = {
  contentStyle: { backgroundColor: colors.bg },
  headerShown: false as boolean,
};

export default function RootNavigator({ token, pinConfigured, unlocked }: Props) {
  const stackKey = !token
    ? 'guest'
    : !pinConfigured
      ? 'pin-setup'
      : !unlocked
        ? 'unlock'
        : 'main';

  return (
    <Stack.Navigator key={stackKey} screenOptions={authScreenOptions}>
      {!token ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : !pinConfigured ? (
        <Stack.Screen
          name="CreatePin"
          component={CreatePinScreen}
          options={{
            headerShown: true,
            headerTintColor: colors.text,
            headerStyle: { backgroundColor: colors.bg },
            headerShadowVisible: false,
            title: '',
            headerBackVisible: false,
          }}
        />
      ) : !unlocked ? (
        <Stack.Screen
          name="Unlock"
          component={UnlockScreen}
          options={{
            headerShown: true,
            headerTintColor: colors.text,
            headerStyle: { backgroundColor: colors.bg },
            headerShadowVisible: false,
          }}
        />
      ) : (
        <Stack.Screen name="MainApp" component={MainAppNavigator} />
      )}
    </Stack.Navigator>
  );
}
