import { StyleSheet, Text, View } from 'react-native';

import WelcomeCategoryPlaceholderIcon from '@/components/WelcomeCategoryPlaceholderIcon';
import {
  defaultWelcomeClusterIcons,
  type WelcomeClusterIcons,
} from '../constants/welcomeCategories';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  title: string;
  clusterIcons?: WelcomeClusterIcons;
};

export default function WelcomeCategoryCard({
  title,
  clusterIcons,
}: Props) {
  const icons = clusterIcons ?? defaultWelcomeClusterIcons;
  return (
    <View style={styles.catCard}>
      <View style={styles.iconCluster}>
        {icons.map((src, i) => (
          <View
            key={i}
            style={[
              styles.iconSlot,
              i > 0 && styles.iconOverlap,
              i === 1 && styles.iconSlotCenter,
            ]}
          >
            <WelcomeCategoryPlaceholderIcon size={36} source={src} />
          </View>
        ))}
      </View>
      <Text style={styles.catTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  catCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 136,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    position: 'relative',
    zIndex: 0,
  },
  iconSlot: {
    width: 36,
    height: 36,
    zIndex: 1,
  },
  iconSlotCenter: {
    zIndex: 3,
    elevation: 4,
  },
  iconOverlap: {
    marginLeft: -14,
  },
  catTitle: {
    alignSelf: 'stretch',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
});
