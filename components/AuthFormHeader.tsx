import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import type { ComponentProps } from 'react';
import type { ImageStyle, StyleProp } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  title: string;
  subtitle: string;
  leadingImage?: ComponentProps<typeof Image>['source'];
  leadingImageStyle?: StyleProp<ImageStyle>;
};

export default function AuthFormHeader({
  title,
  subtitle,
  leadingImage,
  leadingImageStyle,
}: Props) {
  return (
    <View style={styles.row}>
      {leadingImage ? (
        <Image
          source={leadingImage}
          style={[styles.leadingImage, leadingImageStyle]}
          contentFit="contain"
        />
      ) : (
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="account-outline"
            size={26}
            color={colors.accent}
          />
        </View>
      )}
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  leadingImage: { width: 49, height: 49 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  title: { fontSize: 15, fontWeight: '500', color: colors.text },
  sub: { fontSize: 15, color: colors.muted, marginTop: 4 },
});
