import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const KEYS: [string, string][] = [
  ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
  ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
  ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
  ['*', ''], ['0', ''], ['#', ''],
];

type Props = { onPress: (key: string) => void; dark?: boolean };

export function Keypad({ onPress, dark }: Props) {
  return (
    <View style={styles.grid}>
      {KEYS.map(([digit, letters]) => (
        <Pressable
          key={digit}
          onPress={() => onPress(digit)}
          style={({ pressed }) => [styles.key, dark && styles.keyDark, pressed && styles.pressed]}
        >
          <Text style={[styles.digit, dark && styles.light]}>{digit}</Text>
          {!!letters && <Text style={[styles.letters, dark && styles.light]}>{letters}</Text>}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 18, maxWidth: 300 },
  key: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  keyDark: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'transparent' },
  pressed: { opacity: 0.6 },
  digit: { fontSize: 30, color: colors.text },
  letters: { fontSize: 10, letterSpacing: 1.5, color: colors.muted, marginTop: -2 },
  light: { color: '#fff' },
});
