import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { countries, Country, flagOf } from '../data/countries';
import { colors, radius } from '../theme';
import { formatRate } from '../utils/format';

type Props = { selected?: string; onSelect: (c: Country) => void };

export function CountryList({ selected, onSelect }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, '');
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q) || c.dial.startsWith(q));
  }, [query]);

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.search}
        placeholder="Search country or code"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.code}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, item.code === selected && styles.selected]}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.flag}>{flagOf(item.code)}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.dial}>+{item.dial}</Text>
            <Text style={styles.rate}>{formatRate(item.rate)}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  search: {
    margin: 16,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  selected: { backgroundColor: '#EEE7FF' },
  flag: { fontSize: 20 },
  name: { flex: 1, fontSize: 14, color: colors.text },
  dial: { color: colors.muted, width: 56 },
  rate: { color: colors.accent, fontWeight: '700', width: 74, textAlign: 'right' },
});
