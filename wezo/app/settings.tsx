import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Card, SectionTitle } from '../src/components/ui';
import { CountryButton } from '../src/components/CountryButton';
import { AUTO_TOPUP_THRESHOLD, useStore } from '../src/state/store';
import { colors, radius } from '../src/theme';
import { formatMoney } from '../src/utils/format';

const AUTO_AMOUNTS = [5, 10, 25];

export default function SettingsScreen() {
  const { settings, updateSettings, resetAll } = useStore();

  const confirmReset = () =>
    Alert.alert(
      'Reset app data',
      'This deletes your balance, contacts, call history, messages and profile on this phone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAll();
            router.navigate('/');
          },
        },
      ],
    );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionTitle>Calling</SectionTitle>
      <Text style={styles.help}>Default country for the keypad</Text>
      <CountryButton />

      <SectionTitle>Balance</SectionTitle>
      <Card>
        <ToggleRow
          label="Low balance alert"
          detail={`Show a reminder on the keypad when credit drops below ${formatMoney(AUTO_TOPUP_THRESHOLD)}`}
          value={settings.lowBalanceAlert}
          onChange={(v) => updateSettings({ lowBalanceAlert: v })}
        />
        <ToggleRow
          label="Auto top-up"
          detail={`Add credit automatically when it drops below ${formatMoney(AUTO_TOPUP_THRESHOLD)}`}
          value={settings.autoTopUp}
          onChange={(v) => updateSettings({ autoTopUp: v })}
        />
        {settings.autoTopUp && (
          <View style={styles.amounts}>
            {AUTO_AMOUNTS.map((a) => {
              const on = settings.autoTopUpAmount === a;
              return (
                <Pressable
                  key={a}
                  style={[styles.amount, on && styles.amountOn]}
                  onPress={() => updateSettings({ autoTopUpAmount: a })}
                >
                  <Text style={[styles.amountText, on && { color: '#fff' }]}>{formatMoney(a)}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </Card>

      <SectionTitle>App</SectionTitle>
      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>{Constants.expoConfig?.version ?? '–'}</Text>
        </View>
        <Pressable style={styles.row} onPress={confirmReset}>
          <Text style={[styles.label, { color: colors.danger }]}>Reset app data</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

function ToggleRow({
  label,
  detail,
  value,
  onChange,
}: {
  label: string;
  detail: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.primary, false: colors.border }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  help: { fontSize: 12, color: colors.muted, marginBottom: -4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 14, color: colors.text },
  detail: { fontSize: 12, color: colors.muted },
  value: { marginLeft: 'auto', fontSize: 14, color: colors.muted },
  amounts: { flexDirection: 'row', gap: 10, padding: 14 },
  amount: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  amountOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  amountText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
