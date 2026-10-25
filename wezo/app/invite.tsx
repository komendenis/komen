import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, formStyles, PrimaryButton, SectionTitle } from '../src/components/ui';
import { INVITE_BONUS, useStore } from '../src/state/store';
import { colors, radius } from '../src/theme';
import { formatMoney } from '../src/utils/format';

export default function InviteScreen() {
  const { inviteCode, inviteRedeemed, redeemInvite } = useStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const share = () =>
    Share.share({
      message: `Call and text abroad cheaply with WEZO. Use my code ${inviteCode} to get ${formatMoney(INVITE_BONUS)} free credit.`,
    }).catch(() => {});

  const redeem = () => {
    const err = redeemInvite(code);
    setError(err ?? '');
    if (!err) setDone(true);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <Ionicons name="gift" size={36} color="#fff" />
        <Text style={styles.heroTitle}>Give {formatMoney(INVITE_BONUS)}, get {formatMoney(INVITE_BONUS)}</Text>
        <Text style={styles.heroText}>
          Friends get {formatMoney(INVITE_BONUS)} free credit with your code. You get {formatMoney(INVITE_BONUS)} when
          they make their first top-up.
        </Text>
      </View>

      <SectionTitle>Your code</SectionTitle>
      <Card style={styles.codeCard}>
        <Text style={styles.code} selectable>
          {inviteCode}
        </Text>
      </Card>
      <PrimaryButton label="Share invite" onPress={share} />

      <SectionTitle>Got a code from a friend?</SectionTitle>
      {inviteRedeemed || done ? (
        <Text style={styles.success}>
          {done ? `${formatMoney(INVITE_BONUS)} was added to your balance.` : 'You have already used an invite code.'}
        </Text>
      ) : (
        <>
          <TextInput
            style={formStyles.input}
            value={code}
            onChangeText={(t) => {
              setCode(t);
              setError('');
            }}
            placeholder="WEZO-AB12"
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {!!error && <Text style={formStyles.error}>{error}</Text>}
          <PrimaryButton label="Get free credit" onPress={redeem} disabled={!code.trim()} />
        </>
      )}
      <Text style={styles.demo}>Demo: codes are checked on the phone only. A real backend must verify them.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 20, alignItems: 'center', gap: 6 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  heroText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  codeCard: { padding: 16, alignItems: 'center' },
  code: { fontSize: 22, fontWeight: '800', letterSpacing: 2, color: colors.primary },
  success: { fontSize: 14, color: colors.accent, fontWeight: '600' },
  demo: { fontSize: 11, color: colors.muted, textAlign: 'center' },
});
