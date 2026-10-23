import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { callProvider } from '../../src/services/callService';
import { useStore } from '../../src/state/store';
import { colors, radius } from '../../src/theme';
import { formatMoney } from '../../src/utils/format';

const AMOUNTS = [5, 10, 25, 50];

export default function AccountScreen() {
  const { balance, topUp, recents } = useStore();
  const minutesTalked = Math.round(recents.reduce((sum, r) => sum + r.durationSec, 0) / 60);

  const buy = (amount: number) =>
    Alert.alert('Add credit', `Add ${formatMoney(amount)} to your WEZO balance?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Add', onPress: () => topUp(amount) },
    ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>WEZO credit</Text>
        <Text style={styles.balance}>{formatMoney(balance)}</Text>
        <Text style={styles.balanceSub}>
          {recents.length} calls · {minutesTalked} min talked
        </Text>
      </View>

      <Text style={styles.section}>Top up</Text>
      <View style={styles.grid}>
        {AMOUNTS.map((a) => (
          <Pressable key={a} style={styles.amount} onPress={() => buy(a)}>
            <Text style={styles.amountText}>{formatMoney(a)}</Text>
          </Pressable>
        ))}
      </View>

      {callProvider.isDemo && (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Demo mode</Text>
          <Text style={styles.noticeText}>
            Calls are simulated and top-ups are free; no real money is charged. Connect a VoIP provider
            and a payment provider to go live (see README).
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  balanceCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 24 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  balance: { color: '#fff', fontSize: 34, fontWeight: '800', marginVertical: 4 },
  balanceSub: { color: 'rgba(255,255,255,0.8)' },
  section: { fontSize: 15, fontWeight: '700', color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  amount: {
    flexGrow: 1,
    flexBasis: '40%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 18,
    alignItems: 'center',
  },
  amountText: { fontSize: 17, fontWeight: '700', color: colors.primary },
  notice: { backgroundColor: '#FFF6E5', borderRadius: radius.md, padding: 14 },
  noticeTitle: { fontWeight: '700', color: '#8A5A00', marginBottom: 4 },
  noticeText: { color: '#8A5A00', lineHeight: 20 },
});
