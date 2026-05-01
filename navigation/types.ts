import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  CreatePin: undefined;
  Unlock: undefined;
  MainApp: undefined;
};

export type ProfileStackParamList = {
  SettingsMain: undefined;
  Language: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  PortfolioTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
};

export type MainAppStackParamList = {
  MainTabs: undefined;
  PostDetail: { postId: number };
};

export type RootNav = NativeStackNavigationProp<RootStackParamList>;

export type HomeTabNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<MainAppStackParamList>
>;

export type SearchTabNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'SearchTab'>,
  NativeStackNavigationProp<MainAppStackParamList>
>;
