import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, MenuRow } from '../../src/components/ui';
import { callProvider } from '../../src/services/callService';
import { useStore } from '../../src/state/store';
import { colors, radius } from '../../src/theme';
import { formatMoney } from '../../src/utils/format';

export default function AccountScreen() {
  const { balance, profile, settings, inviteRedeemed } = useStore();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
      <View>
        <Text style={styles.hello}>Hello</Text>
        {profile.name ? (
          <Text style={styles.name}>{profile.name}</Text>
        ) : (
          <Pressable onPress={() => router.push('/profile')}>
            <Text style={[styles.name, { color: colors.primary }]}>Add your name</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.balanceCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.balanceLabel}>WEZO credit</Text>
          <Text style={styles.balance}>{formatMoney(balance)}</Text>
          {settings.autoTopUp && (
            <Text style={styles.balanceSub}>Auto top-up on · {formatMoney(settings.autoTopUpAmount)}</Text>
          )}
        </View>
        <Pressable style={styles.topUpBtn} onPress={() => router.push('/topup')}>
          <Text style={styles.topUpText}>Top up</Text>
        </Pressable>
      </View>

      <Card>
        <MenuRow icon="person-outline" label="Profile" onPress={() => router.push('/profile')} />
        <MenuRow icon="wallet-outline" label="Top up" onPress={() => router.push('/topup')} />
        <MenuRow
          icon="gift-outline"
          label="Invite / Get free credit"
          detail={inviteRedeemed ? undefined : '+$1'}
          onPress={() => router.push('/invite')}
        />
        <MenuRow icon="stats-chart-outline" label="Monthly recaps" onPress={() => router.push('/recaps')} />
        <MenuRow icon="globe-outline" label="Calling rates" onPress={() => router.push('/rates')} />
        <MenuRow icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />
        <MenuRow icon="help-circle-outline" label="Help" onPress={() => router.push('/help')} />
      </Card>

      {callProvider.isDemo && (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Demo mode</Text>
          <Text style={styles.noticeText}>
            Calls and messages are simulated and top-ups are free; no real money is charged.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 18, paddingBottom: 32 },
  hello: { fontSize: 24, fontWeight: '700', color: colors.text },
  name: { fontSize: 24, fontWeight: '700', color: colors.text },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 18,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontWeight: '600', fontSize: 12 },
  balance: { color: '#fff', fontSize: 30, fontWeight: '800', marginVertical: 2 },
  balanceSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  topUpBtn: { backgroundColor: '#fff', borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 10 },
  topUpText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  notice: { backgroundColor: '#FFF6E5', borderRadius: radius.md, padding: 14 },
  noticeTitle: { fontWeight: '700', color: '#8A5A00', marginBottom: 4, fontSize: 13 },
  noticeText: { color: '#8A5A00', lineHeight: 18, fontSize: 13 },
});
