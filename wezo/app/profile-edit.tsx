import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { formStyles, PrimaryButton } from '../src/components/ui';
import { useStore } from '../src/state/store';
import { colors } from '../src/theme';

const FIELDS = {
  name: { title: 'Name', placeholder: 'Your name', keyboard: 'default' as const },
  email: { title: 'Email', placeholder: 'you@example.com', keyboard: 'email-address' as const },
};

export default function ProfileEditScreen() {
  const { field: raw } = useLocalSearchParams<{ field: string }>();
  const field = raw === 'email' ? 'email' : 'name';
  const config = FIELDS[field];
  const { profile, updateProfile } = useStore();
  const [value, setValue] = useState(profile[field]);
  const [error, setError] = useState('');

  const save = () => {
    const v = value.trim();
    if (field === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) {
      setError('Enter a valid email address, or leave it empty.');
      return;
    }
    updateProfile({ [field]: v });
    router.back();
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: config.title }} />
      <TextInput
        style={formStyles.input}
        value={value}
        onChangeText={(t) => {
          setValue(t);
          setError('');
        }}
        placeholder={config.placeholder}
        keyboardType={config.keyboard}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
        autoFocus
        onSubmitEditing={save}
      />
      {!!error && <Text style={formStyles.error}>{error}</Text>}
      {field === 'email' && <Text style={styles.help}>We send receipts for your top-ups here.</Text>}
      <PrimaryButton label="Save" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 16, gap: 12 },
  help: { fontSize: 12, color: colors.muted },
});
