import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ComponentProps, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, formStyles, PrimaryButton, SectionTitle } from '../src/components/ui';
import { findCountry } from '../src/data/countries';
import { PaymentMethod, useStore } from '../src/state/store';
import { colors, radius } from '../src/theme';
import { formatMoney, formatWhen } from '../src/utils/format';

const AMOUNTS = [5, 10, 25, 50];
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 200;

const METHODS: { id: PaymentMethod; label: string; icon: ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'card', label: 'Debit or credit card', icon: 'card-outline' },
  { id: 'mpesa', label: 'M-Pesa', icon: 'phone-portrait-outline' },
  { id: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
];

const METHOD_LABELS: Record<PaymentMethod, string> = {
  card: 'Card',
  mpesa: 'M-Pesa',
  paypal: 'PayPal',
  auto: 'Auto top-up',
  invite: 'Invite bonus',
};

export default function TopUpScreen() {
  const { balance, countryCode, payments, topUp } = useStore();
  const [amount, setAmount] = useState(10);
  const [custom, setCustom] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const country = findCountry(countryCode);

  const chosen = custom ? Number(custom.replace(',', '.')) : amount;
  const valid = Number.isFinite(chosen) && chosen >= MIN_AMOUNT && chosen <= MAX_AMOUNT;
  const minutes = valid ? Math.floor((balance + chosen) / country.rate) : 0;

  const pay = () =>
    Alert.alert('Confirm top-up', `Add ${formatMoney(chosen)} with ${METHOD_LABELS[method]}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Pay',
        onPress: () => {
          topUp(+chosen.toFixed(2), method);
          Alert.alert('Credit added', `${formatMoney(chosen)} was added to your balance.`);
          router.back();
        },
      },
    ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.balance}>Balance {formatMoney(balance)}</Text>

      <SectionTitle>Amount</SectionTitle>
      <View style={styles.grid}>
        {AMOUNTS.map((a) => {
          const selected = !custom && amount === a;
          return (
            <Pressable
              key={a}
              style={[styles.amount, selected && styles.selected]}
              onPress={() => {
                setAmount(a);
                setCustom('');
              }}
            >
              <Text style={[styles.amountText, selected && { color: '#fff' }]}>{formatMoney(a)}</Text>
            </Pressable>
          );
        })}
      </View>
      <TextInput
        style={formStyles.input}
        value={custom}
        onChangeText={(t) => setCustom(t.replace(/[^0-9.,]/g, ''))}
        placeholder={`Other amount (${formatMoney(MIN_AMOUNT)}–${formatMoney(MAX_AMOUNT)})`}
        keyboardType="decimal-pad"
      />
      {!!custom && !valid && (
        <Text style={formStyles.error}>
          Enter an amount from {formatMoney(MIN_AMOUNT)} to {formatMoney(MAX_AMOUNT)}.
        </Text>
      )}
      {valid && (
        <Text style={styles.hint}>
          New balance {formatMoney(balance + chosen)} ≈ {minutes} min to {country.name}
        </Text>
      )}

      <SectionTitle>Pay with</SectionTitle>
      <Card>
        {METHODS.map((m) => (
          <Pressable key={m.id} style={styles.method} onPress={() => setMethod(m.id)}>
            <Ionicons name={m.icon} size={20} color={colors.primary} />
            <Text style={styles.methodLabel}>{m.label}</Text>
            <Ionicons
              name={method === m.id ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={method === m.id ? colors.primary : colors.muted}
            />
          </Pressable>
        ))}
      </Card>

      <PrimaryButton label={valid ? `Pay ${formatMoney(chosen)}` : 'Pay'} onPress={pay} disabled={!valid} />
      <Text style={styles.demo}>Demo: no real payment is taken.</Text>

      {payments.length > 0 && (
        <>
          <SectionTitle>History</SectionTitle>
          <Card>
            {payments.slice(0, 20).map((p) => (
              <View key={p.id} style={styles.method}>
                <Text style={styles.methodLabel}>{METHOD_LABELS[p.method]}</Text>
                <Text style={styles.when}>{formatWhen(p.at)}</Text>
                <Text style={styles.plus}>+{formatMoney(p.amount)}</Text>
              </View>
            ))}
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  balance: { fontSize: 14, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amount: {
    flexGrow: 1,
    flexBasis: '40%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  amountText: { fontSize: 17, fontWeight: '700', color: colors.primary },
  hint: { fontSize: 12, color: colors.accent, fontWeight: '600' },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  methodLabel: { flex: 1, fontSize: 14, color: colors.text },
  when: { fontSize: 12, color: colors.muted },
  plus: { fontSize: 14, fontWeight: '700', color: colors.accent, minWidth: 64, textAlign: 'right' },
  demo: { fontSize: 11, color: colors.muted, textAlign: 'center' },
});
