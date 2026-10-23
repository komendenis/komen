import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Keypad } from '../src/components/Keypad';
import { findCountry, flagOf } from '../src/data/countries';
import { CallEndReason, callProvider, CallSession } from '../src/services/callService';
import { useStore } from '../src/state/store';
import { colors } from '../src/theme';
import { callCost, e164, formatDuration, formatLocal, formatMoney, formatRate } from '../src/utils/format';

type Status = 'calling' | 'ringing' | 'connected' | 'ended';

const END_MESSAGES: Record<CallEndReason, string> = {
  hangup: 'Call ended',
  remote: 'Call ended',
  failed: 'Call failed',
  'no-credit': 'Out of credit',
};

export default function CallScreen() {
  const params = useLocalSearchParams<{ countryCode: string; number: string; name?: string }>();
  const { balance, recordCall } = useStore();
  const country = findCountry(params.countryCode);
  const number = params.number ?? '';

  const [status, setStatus] = useState<Status>('calling');
  const [endMessage, setEndMessage] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

  const session = useRef<CallSession | null>(null);
  const connectedAt = useRef<number | null>(null);
  const startBalance = useRef(balance);

  useEffect(() => {
    if (startBalance.current < country.rate) {
      Alert.alert('Not enough credit', 'Top up your WEZO balance to make this call.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
      return;
    }

    const startedAt = Date.now();
    let ended = false;
    let unmounted = false;

    const finish = (reason: CallEndReason) => {
      if (ended) return;
      ended = true;
      const durationSec = connectedAt.current ? Math.round((Date.now() - connectedAt.current) / 1000) : 0;
      recordCall({
        name: params.name || undefined,
        countryCode: country.code,
        number,
        startedAt,
        durationSec,
        cost: callCost(durationSec, country.rate),
      });
      if (unmounted) return;
      setEndMessage(END_MESSAGES[reason]);
      setStatus('ended');
      setTimeout(() => router.back(), 1200);
    };

    session.current = callProvider.startCall(e164(country.dial, number), {
      onRinging: () => setStatus((s) => (s === 'calling' ? 'ringing' : s)),
      onConnected: () => {
        connectedAt.current = Date.now();
        setStatus('connected');
      },
      onEnded: finish,
    });

    return () => {
      unmounted = true;
      session.current?.hangup();
    };
    // Runs once per call screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== 'connected') return;
    const timer = setInterval(() => {
      const elapsed = Math.round((Date.now() - (connectedAt.current ?? Date.now())) / 1000);
      setSeconds(elapsed);
      // Billing is per started minute: stop before a minute the user can't pay for begins.
      if (callCost(elapsed + 1, country.rate) > startBalance.current) session.current?.hangup('no-credit');
    }, 1000);
    return () => clearInterval(timer);
  }, [status, country.rate]);

  const statusText =
    status === 'calling' ? 'Calling…' :
    status === 'ringing' ? 'Ringing…' :
    status === 'connected' ? formatDuration(seconds) :
    endMessage;

  const title = params.name || `+${country.dial} ${formatLocal(number)}`;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.flag}>{flagOf(country.code)}</Text>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
        {!!params.name && <Text style={styles.sub}>+{country.dial} {formatLocal(number)}</Text>}
        <Text style={styles.status}>{statusText}</Text>
        <Text style={styles.sub}>
          {country.name} · {formatRate(country.rate)}
          {status === 'connected' ? ` · ${formatMoney(callCost(seconds, country.rate))}` : ''}
        </Text>
        {callProvider.isDemo && <Text style={styles.demo}>DEMO CALL: no real call is placed</Text>}
      </View>

      {showKeypad ? (
        <Keypad dark onPress={(d) => session.current?.sendDigits(d)} />
      ) : (
        <View style={styles.controls}>
          <Control
            icon={muted ? 'mic-off' : 'mic'}
            label="Mute"
            active={muted}
            onPress={() => {
              session.current?.setMuted(!muted);
              setMuted(!muted);
            }}
          />
          <Control icon="keypad" label="Keypad" onPress={() => setShowKeypad(true)} />
          <Control
            icon="volume-high"
            label="Speaker"
            active={speaker}
            onPress={() => {
              session.current?.setSpeaker(!speaker);
              setSpeaker(!speaker);
            }}
          />
        </View>
      )}

      <View style={styles.footer}>
        {showKeypad && (
          <Pressable onPress={() => setShowKeypad(false)}>
            <Text style={styles.hide}>Hide keypad</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.endBtn, status === 'ended' && { opacity: 0.4 }]}
          disabled={status === 'ended'}
          onPress={() => session.current?.hangup()}
          accessibilityLabel="End call"
        >
          <Ionicons name="call" size={30} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

type ControlProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  active?: boolean;
  onPress: () => void;
};

function Control({ icon, label, active, onPress }: ControlProps) {
  return (
    <Pressable style={styles.control} onPress={onPress}>
      <View style={[styles.controlIcon, active && styles.controlActive]}>
        <Ionicons name={icon} size={24} color={active ? colors.primaryDark : '#fff'} />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'space-between' },
  header: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 24, gap: 6 },
  flag: { fontSize: 44 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  status: { color: '#fff', fontSize: 17, marginTop: 8 },
  sub: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  demo: { color: colors.accent, fontSize: 11, fontWeight: '700', marginTop: 8, letterSpacing: 0.5 },
  controls: { flexDirection: 'row', gap: 28 },
  control: { alignItems: 'center', gap: 8 },
  controlIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlActive: { backgroundColor: '#fff' },
  controlLabel: { color: '#fff' },
  footer: { alignItems: 'center', gap: 16, paddingBottom: 40 },
  hide: { color: '#fff', fontSize: 14 },
  endBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
