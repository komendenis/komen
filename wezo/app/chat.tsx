import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { findCountry, smsRateOf } from '../src/data/countries';
import { MessageStatus, messageProvider } from '../src/services/messageService';
import { threadIdOf, useStore } from '../src/state/store';
import { colors, radius } from '../src/theme';
import { e164, formatLocal, formatMoney } from '../src/utils/format';
import { placeCall } from '../src/utils/placeCall';

const MAX_LENGTH = 160; // one SMS segment

const STATUS_LABELS: Record<MessageStatus, string> = {
  sending: 'Sending…',
  sent: 'Sent',
  delivered: 'Delivered',
  failed: 'Not sent',
};

export default function ChatScreen() {
  const params = useLocalSearchParams<{ countryCode: string; number: string; name?: string }>();
  const { threads, balance, addMessage, setMessageStatus } = useStore();
  const country = findCountry(params.countryCode);
  const number = params.number ?? '';
  const thread = threads.find((t) => t.id === threadIdOf(country.code, number));
  const name = params.name || thread?.name;
  const price = smsRateOf(country);

  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const send = () => {
    const body = text.trim();
    if (!body) return;
    if (balance < price) {
      setError('Not enough credit. Top up in Account to send messages.');
      return;
    }
    setError('');
    const { threadId, messageId } = addMessage({ countryCode: country.code, number, name, text: body, cost: price });
    setText('');
    messageProvider.send(e164(country.dial, number), body, (status) => setMessageStatus(threadId, messageId, status));
  };

  const messages = [...(thread?.messages ?? [])].reverse();

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: name || `+${country.dial} ${formatLocal(number)}`,
          headerRight: () => (
            <Pressable onPress={() => placeCall(country.code, number, name)} accessibilityLabel="Call" hitSlop={10}>
              <Ionicons name="call" size={20} color={colors.accent} />
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={{ flex: 1 }}>
            <Text style={styles.empty}>
              Say hello. Each message to {country.name} costs {formatMoney(price)}.
            </Text>
          </View>
        ) : (
          <FlatList
            inverted
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <View style={styles.bubbleWrap}>
                <View style={styles.bubble}>
                  <Text style={styles.bubbleText}>{item.text}</Text>
                </View>
                {index === 0 && (
                  <Text style={[styles.status, item.status === 'failed' && { color: colors.danger }]}>
                    {STATUS_LABELS[item.status]}
                  </Text>
                )}
              </View>
            )}
          />
        )}

        {messageProvider.isDemo && <Text style={styles.demo}>Demo: messages are simulated, no real SMS is sent</Text>}
        {!!error && (
          <Pressable onPress={() => router.navigate('/account')}>
            <Text style={styles.error}>{error}</Text>
          </Pressable>
        )}
        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="Text message"
            value={text}
            onChangeText={setText}
            maxLength={MAX_LENGTH}
            multiline
          />
          <Pressable
            style={[styles.sendBtn, !text.trim() && { opacity: 0.4 }]}
            onPress={send}
            disabled={!text.trim()}
            accessibilityLabel="Send"
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </Pressable>
        </View>
        <Text style={styles.meta}>
          {text.length}/{MAX_LENGTH} · {formatMoney(price)} per message · Balance {formatMoney(balance)}
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, gap: 8 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40, paddingHorizontal: 24 },
  bubbleWrap: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    borderBottomRightRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  bubbleText: { color: '#fff', fontSize: 14, lineHeight: 19 },
  status: { fontSize: 11, color: colors.muted, marginTop: 3, marginRight: 4 },
  demo: { fontSize: 11, color: colors.muted, textAlign: 'center', paddingBottom: 6 },
  error: { fontSize: 12, color: colors.danger, textAlign: 'center', paddingBottom: 6 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12 },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 9,
    fontSize: 14,
    maxHeight: 110,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { fontSize: 11, color: colors.muted, textAlign: 'right', paddingHorizontal: 16, paddingVertical: 6 },
});
