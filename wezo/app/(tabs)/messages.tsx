import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CountryButton } from '../../src/components/CountryButton';
import { findCountry, flagOf } from '../../src/data/countries';
import { Thread, useStore } from '../../src/state/store';
import { colors, radius } from '../../src/theme';
import { formatLocal, formatWhen } from '../../src/utils/format';
import { openChat } from '../../src/utils/openChat';

export default function MessagesScreen() {
  const { threads, contacts, countryCode, deleteThread } = useStore();
  const [composing, setComposing] = useState(false);
  const [number, setNumber] = useState('');

  const start = () => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 5) {
      Alert.alert('Check the number', 'Enter a phone number with at least 5 digits.');
      return;
    }
    const contact = contacts.find((c) => c.countryCode === countryCode && c.number === digits);
    setNumber('');
    setComposing(false);
    openChat(countryCode, digits, contact?.name);
  };

  const confirmDelete = (t: Thread) =>
    Alert.alert('Delete conversation', 'Delete all messages in this conversation?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteThread(t.id) },
    ]);

  return (
    <View style={styles.screen}>
      {composing ? (
        <View style={styles.form}>
          <CountryButton />
          <TextInput
            style={styles.input}
            placeholder={`Phone number (without +${findCountry(countryCode).dial})`}
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
            autoFocus
          />
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setComposing(false)}>
              <Text style={[styles.btnText, { color: colors.primary }]}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={start}>
              <Text style={styles.btnText}>Start chat</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={styles.newRow} onPress={() => setComposing(true)}>
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.newText}>New message</Text>
        </Pressable>
      )}

      <FlatList
        data={threads}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No messages yet. Text anyone abroad, or tap the chat icon on a contact.</Text>
        }
        renderItem={({ item }) => {
          const country = findCountry(item.countryCode);
          const last = item.messages[item.messages.length - 1];
          return (
            <Pressable
              style={styles.item}
              onPress={() => openChat(item.countryCode, item.number, item.name)}
              onLongPress={() => confirmDelete(item)}
            >
              <Text style={styles.flag}>{flagOf(country.code)}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name || `+${country.dial} ${formatLocal(item.number)}`}
                  </Text>
                  <Text style={styles.time}>{formatWhen(item.updatedAt)}</Text>
                </View>
                <Text style={styles.preview} numberOfLines={1}>
                  {last?.text ?? ''}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 16, gap: 12 },
  form: { gap: 10 },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.md, padding: 14, alignItems: 'center' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  newRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  newText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40, paddingHorizontal: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
  },
  flag: { fontSize: 22 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  name: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  time: { fontSize: 11, color: colors.muted },
  preview: { color: colors.muted, marginTop: 2, fontSize: 13 },
});
