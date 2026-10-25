import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, SectionTitle } from '../src/components/ui';
import { colors } from '../src/theme';

// TODO: replace with the real support address before launch.
const SUPPORT_EMAIL = 'support@example.com';

const FAQ = [
  {
    q: 'How are calls charged?',
    a: 'Each country has a price per minute, shown on the keypad and under Calling rates. Calls are billed per started minute, and a call ends on its own when your credit runs out.',
  },
  {
    q: 'How much does a text cost?',
    a: 'The price per message is shown at the bottom of each chat. One message is up to 160 characters.',
  },
  {
    q: 'What is auto top-up?',
    a: 'When it is on, WEZO adds your chosen amount whenever your balance drops below $1, so calls are not cut off. Turn it on in Settings.',
  },
  {
    q: 'How do I get free credit?',
    a: 'Open Invite / Get free credit. Share your code with friends, or enter a friend’s code to get $1.',
  },
  {
    q: 'Why does it say demo?',
    a: 'This version simulates calls, texts and payments while the calling and payment services are being connected. Nothing is charged.',
  },
];

export default function HelpScreen() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionTitle>Common questions</SectionTitle>
      <Card>
        {FAQ.map((item, i) => (
          <Pressable key={item.q} style={styles.item} onPress={() => setOpen(open === i ? null : i)}>
            <View style={styles.qRow}>
              <Text style={styles.q}>{item.q}</Text>
              <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.muted} />
            </View>
            {open === i && <Text style={styles.a}>{item.a}</Text>}
          </Pressable>
        ))}
      </Card>

      <SectionTitle>Contact us</SectionTitle>
      <Card style={{ padding: 14, gap: 4 }}>
        <Text style={styles.a}>Email our support team and include your phone number.</Text>
        <Text style={styles.email} selectable>
          {SUPPORT_EMAIL}
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  item: { padding: 14, gap: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  q: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  a: { fontSize: 13, color: colors.muted, lineHeight: 19 },
  email: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
