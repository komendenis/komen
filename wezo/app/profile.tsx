import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { formStyles, PrimaryButton } from '../src/components/ui';
import { useStore } from '../src/state/store';
import { colors } from '../src/theme';

export default function ProfileScreen() {
  const { profile, updateProfile } = useStore();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [error, setError] = useState('');

  const save = () => {
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address, or leave it empty.');
      return;
    }
    updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    router.back();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(name.trim()[0] ?? '?').toUpperCase()}</Text>
      </View>
      <View>
        <Text style={formStyles.label}>Name</Text>
        <TextInput style={formStyles.input} value={name} onChangeText={setName} placeholder="Your name" />
      </View>
      <View>
        <Text style={formStyles.label}>Your phone number</Text>
        <TextInput
          style={formStyles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 555 123 4567"
          keyboardType="phone-pad"
        />
      </View>
      <View>
        <Text style={formStyles.label}>Email (for receipts)</Text>
        <TextInput
          style={formStyles.input}
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError('');
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {!!error && <Text style={formStyles.error}>{error}</Text>}
      <PrimaryButton label="Save" onPress={save} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
});
