import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formStyles, PrimaryButton } from '../components/ui';
import { useStore } from '../state/store';
import { colors } from '../theme';

/** Shown on first launch and after logging out. Rendered by the root layout, outside the router. */
export function WelcomeScreen() {
  const { profile, signIn } = useStore();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [error, setError] = useState('');

  const submit = () => {
    if (phone.replace(/\D/g, '').length < 7) {
      setError('Enter your phone number with the country code, for example +254 712 345 678.');
      return;
    }
    signIn(name.trim(), phone.trim());
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Image source={require('../../assets/icon.png')} style={styles.logo} accessibilityLabel="WEZO" />
            <Text style={styles.title}>Call and text abroad</Text>
            <Text style={styles.subtitle}>Low rates to 37 countries. Pay only for what you use.</Text>
          </View>

          <View style={styles.form}>
            <View>
              <Text style={formStyles.label}>Your phone number</Text>
              <TextInput
                style={formStyles.input}
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
                  setError('');
                }}
                placeholder="+254 712 345 678"
                keyboardType="phone-pad"
                autoFocus={!phone}
              />
            </View>
            <View>
              <Text style={formStyles.label}>Name (optional)</Text>
              <TextInput style={formStyles.input} value={name} onChangeText={setName} placeholder="Your name" />
            </View>
            {!!error && <Text style={formStyles.error}>{error}</Text>}
            <PrimaryButton label="Continue" onPress={submit} />
            <Text style={styles.demo}>Demo: no verification code is sent yet.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 32 },
  hero: { alignItems: 'center', gap: 8 },
  logo: { width: 84, height: 84, borderRadius: 20, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  form: { gap: 14 },
  demo: { fontSize: 11, color: colors.muted, textAlign: 'center' },
});
