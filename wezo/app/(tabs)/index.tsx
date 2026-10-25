import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CountryButton } from '../../src/components/CountryButton';
import { Keypad } from '../../src/components/Keypad';
import { findCountry } from '../../src/data/countries';
import { AUTO_TOPUP_THRESHOLD, useStore } from '../../src/state/store';
import { colors } from '../../src/theme';
import { formatLocal, formatMoney } from '../../src/utils/format';
import { placeCall } from '../../src/utils/placeCall';

export default function KeypadScreen() {
  const { countryCode, balance, contacts, settings } = useStore();
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState('');
  const country = findCountry(countryCode);
  const match = contacts.find((c) => c.countryCode === countryCode && c.number === digits);

  const press = (key: string) => {
    if (/\d/.test(key) && digits.length < 15) setDigits((d) => d + key);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      {settings.lowBalanceAlert && balance < AUTO_TOPUP_THRESHOLD && (
        <Pressable style={styles.lowBanner} onPress={() => router.push('/topup')}>
          <Text style={styles.lowText}>
            Low credit: about {Math.floor(balance / country.rate)} min left to {country.name}.
          </Text>
          <Text style={styles.lowAction}>Add credit</Text>
        </Pressable>
      )}
      <View style={styles.top}>
        <CountryButton />
        <Pressable onPress={() => router.push('/topup')}>
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
          <Ionicons name="call" size={28} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.side}
          onPress={() => setDigits((d) => d.slice(0, -1))}
          onLongPress={() => setDigits('')}
          disabled={!digits}
          accessibilityLabel="Delete"
        >
          {!!digits && <Ionicons name="backspace-outline" size={24} color={colors.muted} />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', padding: 16, gap: 16 },
  top: { alignSelf: 'stretch', gap: 8 },
  lowBanner: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.selected,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  lowText: { flex: 1, fontSize: 12, color: colors.text },
  lowAction: { fontSize: 12, fontWeight: '700', color: colors.primary },
  balance: { textAlign: 'right', color: colors.primary, fontWeight: '600' },
  display: { alignSelf: 'stretch', alignItems: 'center', minHeight: 70, justifyContent: 'center' },
  number: { fontSize: 24, fontWeight: '500', color: colors.text },
  hint: { color: colors.muted, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 36 },
  side: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  callBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
