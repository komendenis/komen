import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CountryButton } from '../../src/components/CountryButton';
import { findCountry, flagOf } from '../../src/data/countries';
import { Contact, useStore } from '../../src/state/store';
import { colors, radius } from '../../src/theme';
import { formatLocal, formatRate } from '../../src/utils/format';
import { placeCall } from '../../src/utils/placeCall';

export default function ContactsScreen() {
  const { contacts, countryCode, addContact, removeContact } = useStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const save = () => {
    const digits = number.replace(/\D/g, '');
    if (!name.trim() || digits.length < 5) {
      Alert.alert('Missing details', 'Enter a name and a valid phone number.');
      return;
    }
    addContact({ name: name.trim(), number: digits, countryCode });
    setName('');
    setNumber('');
    setAdding(false);
  };

  const confirmRemove = (c: Contact) =>
    Alert.alert('Delete contact', `Remove ${c.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeContact(c.id) },
    ]);

  return (
    <View style={styles.screen}>
      {adding ? (
        <View style={styles.form}>
          <CountryButton />
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput
            style={styles.input}
            placeholder={`Phone number (without +${findCountry(countryCode).dial})`}
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
          />
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setAdding(false)}>
              <Text style={[styles.btnText, { color: colors.primary }]}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={save}>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={styles.addRow} onPress={() => setAdding(true)}>
          <Ionicons name="person-add" size={20} color={colors.primary} />
          <Text style={styles.addText}>Add contact</Text>
        </Pressable>
      )}

      <FlatList
        data={contacts}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.empty}>No contacts yet. Add the people you call abroad.</Text>}
        renderItem={({ item }) => {
          const country = findCountry(item.countryCode);
          return (
            <Pressable
              style={styles.item}
              onPress={() => placeCall(item.countryCode, item.number, item.name)}
              onLongPress={() => confirmRemove(item)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0]?.toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>
                  {flagOf(country.code)} +{country.dial} {formatLocal(item.number)} · {formatRate(country.rate)}
                </Text>
              </View>
              <Ionicons name="call" size={22} color={colors.accent} />
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
    fontSize: 16,
  },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.md, padding: 14, alignItems: 'center' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  addText: { color: colors.primary, fontWeight: '600', fontSize: 16 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  sub: { color: colors.muted, marginTop: 2 },
});
