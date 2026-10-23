import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { findCountry, flagOf } from '../../src/data/countries';
import { useStore } from '../../src/state/store';
import { colors, radius } from '../../src/theme';
import { formatDuration, formatLocal, formatMoney, formatWhen } from '../../src/utils/format';
import { placeCall } from '../../src/utils/placeCall';

export default function RecentsScreen() {
  const { recents, clearRecents } = useStore();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        recents.length ? (
          <Pressable
            style={{ paddingHorizontal: 16 }}
            onPress={() =>
              Alert.alert('Clear recents', 'Delete your whole call history?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearRecents },
              ])
            }
          >
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Clear</Text>
          </Pressable>
        ) : null,
    });
  }, [navigation, recents.length, clearRecents]);

  return (
    <FlatList
      style={styles.screen}
      data={recents}
      keyExtractor={(r) => r.id}
      contentContainerStyle={{ gap: 8, padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No calls yet.</Text>}
      renderItem={({ item }) => {
        const country = findCountry(item.countryCode);
        const missed = item.durationSec === 0;
        return (
          <Pressable style={styles.item} onPress={() => placeCall(item.countryCode, item.number, item.name)}>
            <Text style={styles.flag}>{flagOf(country.code)}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, missed && { color: colors.danger }]}>
                {item.name || `+${country.dial} ${formatLocal(item.number)}`}
              </Text>
              <Text style={styles.sub}>
                {formatWhen(item.startedAt)} · {missed ? 'Not connected' : formatDuration(item.durationSec)}
                {item.cost > 0 ? ` · ${formatMoney(item.cost)}` : ''}
              </Text>
            </View>
            <Ionicons name="call-outline" size={22} color={colors.accent} />
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
  },
  flag: { fontSize: 22 },
  name: { fontSize: 14, fontWeight: '600', color: colors.text },
  sub: { color: colors.muted, marginTop: 2 },
});
