import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../src/components/ui';
import { findCountry, flagOf } from '../src/data/countries';
import { useStore } from '../src/state/store';
import { colors } from '../src/theme';
import { formatMoney } from '../src/utils/format';

type Recap = {
  key: string; // YYYY-MM
  calls: number;
  seconds: number;
  callSpend: number;
  texts: number;
  textSpend: number;
  toppedUp: number;
  countries: Record<string, number>; // seconds per country
};

const monthKey = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const monthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString([], { month: 'long', year: 'numeric' });
};

export default function RecapsScreen() {
  const { recents, threads, payments } = useStore();
  const recaps = new Map<string, Recap>();
  const get = (ts: number) => {
    const key = monthKey(ts);
    if (!recaps.has(key)) {
      recaps.set(key, { key, calls: 0, seconds: 0, callSpend: 0, texts: 0, textSpend: 0, toppedUp: 0, countries: {} });
    }
    return recaps.get(key)!;
  };

  for (const r of recents) {
    const m = get(r.startedAt);
    m.calls += 1;
    m.seconds += r.durationSec;
    m.callSpend += r.cost;
    m.countries[r.countryCode] = (m.countries[r.countryCode] ?? 0) + r.durationSec;
  }
  for (const t of threads) {
    for (const msg of t.messages) {
      const m = get(msg.sentAt);
      m.texts += 1;
      m.textSpend += msg.cost;
    }
  }
  for (const p of payments) get(p.at).toppedUp += p.amount;

  const months = [...recaps.values()].sort((a, b) => b.key.localeCompare(a.key));

  if (months.length === 0) {
    return (
      <View style={[styles.screen, { padding: 24 }]}>
        <Text style={styles.empty}>Your first recap appears here after you make a call, send a text or top up.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {months.map((m) => {
        const top = Object.entries(m.countries).sort((a, b) => b[1] - a[1])[0];
        const topCountry = top && top[1] > 0 ? findCountry(top[0]) : null;
        return (
          <Card key={m.key} style={styles.card}>
            <Text style={styles.month}>{monthLabel(m.key)}</Text>
            <View style={styles.stats}>
              <Stat value={String(Math.round(m.seconds / 60))} label="minutes" />
              <Stat value={String(m.calls)} label="calls" />
              <Stat value={String(m.texts)} label="texts" />
              <Stat value={formatMoney(m.callSpend + m.textSpend)} label="spent" />
            </View>
            {topCountry && (
              <Text style={styles.line}>
                Most called: {flagOf(topCountry.code)} {topCountry.name}
              </Text>
            )}
            {m.toppedUp > 0 && <Text style={styles.line}>Credit added: {formatMoney(m.toppedUp)}</Text>}
          </Card>
        );
      })}
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40, fontSize: 14 },
  card: { padding: 16, gap: 10 },
  month: { fontSize: 16, fontWeight: '700', color: colors.text },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.muted },
  line: { fontSize: 13, color: colors.text },
});
