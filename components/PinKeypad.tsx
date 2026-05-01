import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

const ROWS: (string | 'del')[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

type Props = {
  onDigit: (d: string) => void;
  onDelete: () => void;
};

export default function PinKeypad({ onDigit, onDelete }: Props) {
  return (
    <View style={styles.wrap}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((cell, ci) => {
            const key = `${ri}-${ci}`;
            if (cell === '') {
              return <View key={key} style={styles.cell} />;
            }
            if (cell === 'del') {
              return (
                <Pressable
                  key={key}
                  style={styles.cell}
                  onPress={onDelete}
                  accessibilityRole="button"
                  accessibilityLabel="delete"
                >
                  <MaterialCommunityIcons
                    name="backspace-outline"
                    size={26}
                    color={colors.text}
                  />
                </Pressable>
              );
            }
            return (
              <Pressable
                key={key}
                style={styles.cell}
                onPress={() => onDigit(cell)}
              >
                <Text style={styles.key}>{cell}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 8,
  },
  key: {
    fontSize: 26,
    fontWeight: '500',
    color: colors.text,
  },
});
