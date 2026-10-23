import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CountryButton } from '../../src/components/CountryButton';
import { Keypad } from '../../src/components/Keypad';
import { findCountry } from '../../src/data/countries';
import { useStore } from '../../src/state/store';
import { colors } from '../../src/theme';
import { formatLocal, formatMoney } from '../../src/utils/format';
import { placeCall } from '../../src/utils/placeCall';

export default function KeypadScreen() {
  const { countryCode, balance, contacts } = useStore();
  const [digits, setDigits] = useState('');
  const country = findCountry(countryCode);
  const match = contacts.find((c) => c.countryCode === countryCode && c.number === digits);

  const press = (key: string) => {
    if (/\d/.test(key) && digits.length < 15) setDigits((d) => d + key);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <CountryButton />
        <Pressable onPress={() => router.push('/account')}>
          <Text style={styles.balance}>Balance {formatMoney(balance)}</Text>
        </Pressable>
      </View>

      <View style={styles.display}>
        <Text style={styles.number} numberOfLines={1} adjustsFontSizeToFit>
          {digits ? `+${country.dial} ${formatLocal(digits)}` : ''}
        </Text>
        <Text style={styles.hint}>{match ? match.name : digits ? ' ' : 'Enter a number to call'}</Text>
      </View>

      <Keypad onPress={press} />

      <View style={styles.actions}>
        <View style={styles.side} />
        <Pressable
          style={[styles.callBtn, !digits && { opacity: 0.4 }]}
          disabled={!digits}
          onPress={() => placeCall(countryCode, digits, match?.name)}
          accessibilityLabel="Call"
        >
          <Ionicons name="call" size={32} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.side}
          onPress={() => setDigits((d) => d.slice(0, -1))}
          onLongPress={() => setDigits('')}
          disabled={!digits}
          accessibilityLabel="Delete"
        >
          {!!digits && <Ionicons name="backspace-outline" size={28} color={colors.muted} />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', padding: 16, gap: 16 },
  top: { alignSelf: 'stretch', gap: 8 },
  balance: { textAlign: 'right', color: colors.primary, fontWeight: '600' },
  display: { alignSelf: 'stretch', alignItems: 'center', minHeight: 70, justifyContent: 'center' },
  number: { fontSize: 32, fontWeight: '500', color: colors.text },
  hint: { color: colors.muted, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 36 },
  side: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  callBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
