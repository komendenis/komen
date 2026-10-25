import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { findCountry, flagOf } from '../data/countries';
import { useStore } from '../state/store';
import { colors, radius } from '../theme';
import { formatRate } from '../utils/format';

export function CountryButton() {
  const { countryCode } = useStore();
  const country = findCountry(countryCode);

  return (
    <Pressable style={styles.btn} onPress={() => router.push('/countries')}>
      <Text style={styles.flag}>{flagOf(country.code)}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>
          {country.name} <Text style={styles.dial}>+{country.dial}</Text>
        </Text>
        <Text style={styles.rate}>{formatRate(country.rate)}</Text>
      </View>
      <Ionicons name="chevron-down" size={20} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flag: { fontSize: 22 },
  name: { fontSize: 14, fontWeight: '600', color: colors.text },
  dial: { color: colors.muted, fontWeight: '400' },
  rate: { fontSize: 12, color: colors.accent, fontWeight: '600', marginTop: 2 },
});
