import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import type { ProfileStackParamList } from '@/navigation/types';
import type { RootState } from '@/store/index';
import { setLocale, type LocaleCode } from '@/store/settingsSlice';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { syncRtlWithLocale } from '@/utils/rtl';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Language'>;

const LANGS: { code: LocaleCode; labelKey: string }[] = [
  { code: 'en', labelKey: 'settings.english' },
  { code: 'ar', labelKey: 'settings.arabic' },
];

export default function LanguageScreen(_props: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const current = useSelector((s: RootState) => s.settings.locale);

  const pick = (code: LocaleCode) => {
    if (code === current) return;
    dispatch(setLocale(code));
    void i18n.changeLanguage(code);
    void syncRtlWithLocale(code);
  };

  return (
    <View style={styles.flex}>
      {LANGS.map(({ code, labelKey }) => {
        const selected = code === current;
        return (
          <Pressable
            key={code}
            style={styles.row}
            onPress={() => pick(code)}
          >
            <MaterialCommunityIcons
              name="earth"
              size={22}
              color={colors.accent}
              style={styles.icon}
            />
            <Text style={styles.label}>{t(labelKey)}</Text>
            <View style={[styles.radio, selected && styles.radioOn]}>
              {selected ? (
                <MaterialCommunityIcons name="check" size={18} color={colors.onAccent} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg, paddingTop: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  icon: { marginRight: 14 },
  label: { flex: 1, fontSize: 17, fontWeight: '600', color: colors.text },
  radio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    borderRadius: radius.pill,
  },
});
